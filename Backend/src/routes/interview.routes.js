const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware") // private access
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 * @route POT/api/interview
 * @description generate new interview report on the basis of user self-description, resume pdf and job description
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController) // first authenticate user, then consider the uploading file


/**
 *  -------- GET REPORT BY interviewId
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/** --- ALL REPORTS OF A SPECFIC USER
 * @route GET /api/interview
 * @description get all interview reports of loggen in user
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter;