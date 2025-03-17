function TicketModal({ ticket }) {
    return (
            <dialog id="my_modal_4" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Ticket {ticket.reference}</h3>
                <p className="py-4">Click the button below to close</p>
                <div className="modal-action">
                <form method="dialog">
                    <button className="btn">Close</button>
                </form>
                </div>
            </div>
            </dialog>
    );
}

export default TicketModal;