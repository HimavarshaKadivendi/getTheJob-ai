const { GoogleGenAI } = require("@google/genai")
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({

    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is ge3nerated")
})



// making a report from user input
async function generateInterviewReport({resume, selfDescription, jobDescription}) {
    
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                    `;
    
    const response = await ai.models.generateContent({
        model:"gemini-3.5-flash", 
        contents: prompt,
        config: {
            // AI's report's format
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    })

    try {
        console.log("RAW RESPONSE:");
        console.log(response.text);

        const parsed = JSON.parse(response.text);

        const report = Array.isArray(parsed)
            ? parsed[0]
            : parsed;

        return interviewReportSchema.parse(report);

    } catch (err) {

        console.error("Error parsing AI response:");
        console.error(err);

        console.log("RAW RESPONSE:");
        console.log(response.text);

        throw err;
    }

}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        executablePath: await chromium.executablePath(),
        headless: true,
        args: chromium.args,
    });

    const page = await browser.newPage();

    // console.log(htmlContent);

    const fs = require('fs');
    fs.writeFileSync('debug.html', htmlContent);


    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    await page.screenshot({
        path: "fullpage.png",
        fullPage: true
    });

    const height = await page.evaluate(() => {
        return document.documentElement.scrollHeight;
    });

    console.log("HEIGHT =", height);

    const dims = await page.evaluate(() => ({
        body: document.body.scrollHeight,
        html: document.documentElement.scrollHeight
    }));

    console.log(dims);

    await page.evaluateHandle('document.fonts.ready');

    
    await page.addStyleTag({
    content: `
        .exp-header {
            page-break-inside: auto !important;
        }

        .contact-info {
            page-break-inside: auto !important;
        }
    `
});
    
    // pdf's data will be present in a buffer format -- which will be returned ny puppeteer
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
            top: "0mm",
            right: "0mm",
            bottom: "0mm",
            left: "0mm"
        }
    });

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({resume, selfDescription, jobDescription}){
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.

                        Do not include titles such as "Aspiring", "Engineer", "Developer", "Enthusiast", "Student", or similar headings below the candidate's name.`;
    
    let response;

    try {
        response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumePdfSchema),
            }
        })
    } catch (error) {
        if(error.response?.status === 429) {
            alert(
                "AI service is currently busy. Please try again in a few minutes."
            );
            return;
        }

        alert(
            error.response?.data?.message ||
            "Something went wrong."
        );

        console.error(error);
    }

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }