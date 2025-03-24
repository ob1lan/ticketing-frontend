import React from "react";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";


function TicketCommentsTab({
  comments,
  newComment,
  setNewComment,
  loadingComments,
  errorComments,
  isSubmittingComment,
  errorPostingComment,
  handleSubmitComment,
  formatTimestamp,
  view
}) {
  return (
    <>
      <div className="h-60 overflow-y-auto p-2 rounded-lg">
        {loadingComments && <p>Loading comments...</p>}
        {errorComments && <p className="text-error">{errorComments}</p>}
        {comments.length === 0 && !loadingComments && <p>No comments yet.</p>}
        {view === "chat" && comments.map((comment) => (
          <div key={comment.id} className={`chat ${comment.author_role === "admin" ? "chat-end" : "chat-start"}`}>
            <div className="chat-image avatar avatar-rounded">
              <div className={comment?.author_role === "admin"
                ? "ring-warning ring-offset-base-100 w-10 rounded-full ring ring-offset-2"
                : "ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2"
              }>
                <img
                  alt={comment.author_fullName}
                  src={comment?.author_avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=username`}
                />
              </div>
            </div>
            <div className="chat-header">
              {comment.author_fullName}
              <time className="text-xs opacity-50 ml-2">{formatTimestamp(comment.created_at)}</time>
            </div>
            <div
              className="chat-bubble"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.message) }}
            />
          </div>
        ))}
        {view === "card" && comments.map((comment) => (
          <div key={comment.id} className="card bg-base-200 shadow-md mb-4">
            <div className="card-body">
              <div className="flex justify-between">

                <div className="font-bold">
                  <div className="chat-image avatar avatar-rounded">
                    <div className={comment?.author_role === "admin"
                      ? "mr-2 ring-warning ring-offset-base-100 w-8 rounded-full ring ring-offset-2"
                      : "mr-2 ring-primary ring-offset-base-100 w-8 rounded-full ring ring-offset-2"
                    }>
                      <img
                        alt={comment.author_fullName}
                        src={comment?.author_avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=username`}
                      />
                    </div>
                  </div>
                  {""}Comment from {comment.author_fullName}
                </div>
                <div className="text-xs opacity-50">
                  {formatTimestamp(comment.created_at)}
                </div>
              </div>
              <div
                className="text-left whitespace-pre-wrap mt-2"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.message) }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* New Comment Editor Section */}
      <div className="mt-2">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Add a comment</legend>
          <textarea
            className="textarea w-full"
            placeholder="Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </fieldset>
        <div className="mt-3">
          <button
            onClick={handleSubmitComment}
            disabled={isSubmittingComment}
            className="btn btn-primary"
          >
            {isSubmittingComment ? "Posting..." : "Post Comment"}
          </button>
          {errorPostingComment && <p className="text-error mt-2">{errorPostingComment}</p>}
        </div>
      </div>
    </>
  );
}

TicketCommentsTab.propTypes = {
  comments: PropTypes.array.isRequired,
  newComment: PropTypes.string.isRequired,
  setNewComment: PropTypes.func.isRequired,
  loadingComments: PropTypes.bool.isRequired,
  errorComments: PropTypes.string,
  isSubmittingComment: PropTypes.bool.isRequired,
  errorPostingComment: PropTypes.string,
  handleSubmitComment: PropTypes.func.isRequired,
  formatTimestamp: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired
};

export default TicketCommentsTab;
