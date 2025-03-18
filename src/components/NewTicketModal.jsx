import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "dompurify";

function NewTicketModal () {
  return (
      <dialog id="createTicketModal" className="modal">
        <div className="modal-box container">
            <h3 className="font-bold text-lg">
                Create New Ticket
            </h3>
        </div>
            {/* Modal Close Button */}
            <div className="modal-action">
            <form method="dialog">
                <button className="btn">Close</button>
            </form>
            </div>
        </dialog>
  );
}

export default NewTicketModal;