import { User } from "../model/user.js"
import { Comment } from "../model/comment.js"
import { Upvote } from "../model/upvote.js"
export async function Postcomment(req,res){
    try{
        const userid = req.params.id
        const qid = req.params.qid
        const text = req.body.text
        const code = req.body.code
        const user = await User.findById(userid)
        if(!text){
            return res.status(400).json({
                "error":true,
                "message":"Empty Comment not Valid!",
                "data":null
            })
        }
        const newComment = await Comment.create({userid : userid , text:text , username : user.username , questionid:qid , code:code , upvote:0})
        if(!newComment){
            throw new Error("Server Error Occured")
        }
        return res.status(200).json({
            "error":false,
            "message":"Comment Added",
            "data":newComment
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Server Error Occured",
            "data":null
        })
    }
}
export async function Delcommnet(req,res){
    try{
        const userid = req.params.id
        const qid = req.params.qid
        const cid = req.params.cid
        const user = req.user;
        const commentToBeDel = await Comment.deleteOne({userid:userid , questionid:qid , _id:cid})
        if(!commentToBeDel || commentToBeDel.deletedCount===0){
            throw new Error('Comment could not be deleted')
        }
        res.status(200).json({
            "error":false,
            "message":"Comment Deleted Successfully"
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Comment could not be deleted"
        })
    }
}
export async function Upvotecomment(req,res){
    try{
        const user = req.user
        const userid=user._id
        const cid=req.params.cid
        const UpVoteCheck = await Upvote.findOne({userid:userid , entityid:cid})
        if(UpVoteCheck!== null){
            const DownVote = await Upvote.findByIdAndDelete(UpVoteCheck._id)
            if(!DownVote){
                throw new Error(500 , "UpVote not removed due to technical error")
            }
            const comment = await Comment.findById(cid)
            const currentUpvotes = comment.upvote - 1;
            comment.upvote = currentUpvotes
            const newUpvoteCount = await comment.save({validateBeforeSave:false})
            return res.status(200).json({
                "error":false,
                "message":"UpVote Removed Succeesfully",
                "data":newUpvoteCount.upvote
            })
        }
        const newUpVote= await Upvote.create({userid:userid , entityid:cid})
        if(!newUpVote){
            throw new Error(500 , "Comment UpVote unsuccessfull")
        }
        const comment = await Comment.findById(cid)
        const currentUpvotes = comment.upvote +1;
        comment.upvote = currentUpvotes
        const newUpvoteCount = await comment.save({validateBeforeSave:false})
        return res.status(200).json({
            "error":false,
            "message":"Comment Upvoted Successfully",
            "data":newUpvoteCount.upvote
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Server Error Occures",
            "data":null
        })
    }
}
export async function Commnets(req,res){
    try{
        const qid= req.params.qid
        const userid= req.params.id
        const question = await Question.findById(qid);

        if (!question) {
            throw new Error("Question not found");
        }

        const feed = await Comment.find({questionid:qid}).sort({createdAt : 1}).exec()
        if(!feed){
            throw new Error("Server Error Occured")
        }
        return res.status(200).json({
            "error":false,
            "message":"Comments Positive",
            "data":{
                comments: feed,
                headline: question.headline 
            }
        })
    }catch(error){
        return res.status(505).json({
            "error":true,
            "message":"Server Error Ocuured",
            "data":null
        })
    }
}