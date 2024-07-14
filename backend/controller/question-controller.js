import { User } from "../model/user.js";
import { Question } from "../model/question.js";
import { Upvote } from "../model/upvote.js";

export async function PublishQuestion(req, res) {
  try {
    const headline = req.body.headline;
    const statement = req.body.statement;
    const code = req.body.code;
    const visibility = req.body.visibility;
    const language = req.body.lang;
    const userid = req.params.id;

    if (!headline || !statement || !code) {
      return res.status(400).json({
        error: true,
        message: "Mandatory Fields not filled",
        data: null,
      });
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User Does not Exists",
        data: null,
      });
    }

    const newQuestion = await Question.create({
      userid: userid,
      headline: headline,
      name: user.username,
      statement: statement,
      code: code,
      visibility: visibility,
      upvote: 0,
      language: language,
    });
    if (!newQuestion) {
      throw new Error("Question could not be posted");
    }

    return res.status(200).json({
      error: false,
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: `Question could not be posted\n${error.message}`,
      data: null,
    });
  }
}
export async function UpvoteQues(req,res){
    try{
        const userid=req.user._id
        const questionid=req.params.qid
        const UpVoteCheck = await Upvote.findOne({userid:userid , entityid:questionid})
        if(UpVoteCheck!== null){
            const DownVote = await Upvote.findByIdAndDelete(UpVoteCheck._id)
            if(!DownVote){
                throw new Error(500 , "UpVote not removed due to technical error")
            }
            const question = await Question.findById(questionid)
            const currentUpvotes = question.upvote - 1;
            question.upvote = currentUpvotes
            const newUpvoteCount = await question.save({validateBeforeSave:false})
            return res.status(200).json({
                "error":false,
                "message":"UpVote Removed Successfully",
                "data":newUpvoteCount.upvote
            })
        }
        const newUpVote= await Upvote.create({userid:userid , entityid:questionid})
        if(!newUpVote){
            throw new Error(500 , "Question UpVote unsuccessfull")
        }
        const question = await Question.findById(questionid)
        const currentUpvotes = question.upvote +1;
        question.upvote = currentUpvotes
        const newUpvoteCount = await question.save({validateBeforeSave:false})
        return res.status(200).json({
            "error":false,
            "message":"Question Upvoted Successfully",
            "data":newUpvoteCount.upvote
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Server Error Occured",
            "data":null
        })
    }
}
export async function Questions(req,res){
    try{
        const userid = req.params.id
        const qid = req.params.qid
        const userCheck = await User.findById(userid)
        const user = req.user
        if(!userCheck){
            return res.status(401).json({
                "error":true ,
                 "message":"Invalid User",
                 "data":null
            })
        }
        const question = await Question.findById(qid)
        if(!question){
            return res.status(401).json({
                "error":true ,
                 "message":"Question unavailable",
                 "data":null
            })
        }
        const upvoteCheck = await Upvote.findOne({userid:userid , entityid:qid})
        const isUpVoted = (!upvoteCheck)?false:true
        const bookmarkCheck = await Bookmark.findOne({userid:userid , questionid:qid})
        const isBookmarked = (!bookmarkCheck)?false:true
        return res.status(200).json({
            "error":false,
            "message":"successfull",
            "data":question,
            "isBookmarked":isBookmarked,
            "isUpVoted":isUpVoted
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Error in fetching questions",
            "data":null
        })
    }
}
export async function DelQuestion(req,res){
    try{
        const userid = req.params.id
        const qid = req.params.qid
        const user = req.user;
        const questionToBeDel = await Question.deleteOne({userid:userid , _id:qid})
        if(!questionToBeDel || questionToBeDel.deletedCount===0){
            throw new Error('Question could not be deleted')
        }
        res.status(200).json({
            "error":false,
            "message":"Question Deleted Successfully"
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Question could not be deleted"
        })
    }
}

