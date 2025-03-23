import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TicketModal from "../TicketModal";
import TicketRow from "./TicketRow";
import { fetchTicketById } from "../../api";

function TicketsTable({ tickets, onTicketUpdated }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleOpenModal = (ticket) => {
        fetchTicketById(ticket.id).then((data) => {
            setSelectedTicket(data);
            setTimeout(() => {
                const modal = document.getElementById("ticket_modal");
                if (modal) modal.showModal();
            }, 0);
        });
    };

    useEffect(() => {
        if (modalVisible && selectedTicket) {
            const modal = document.getElementById("ticket_modal");
            if (modal) modal.showModal();
        }
    }, [modalVisible, selectedTicket]);

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>Reference</th>
                        <th>Title</th>
                        <th className="text-center">Requester</th>
                        <th>Priority</th>
                        <th className="text-center">Assignee</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <TicketRow key={ticket.unique_reference} ticket={ticket} onClickDetails={() => {
                            setModalVisible(true);
                            handleOpenModal(ticket);
                        }} />
                    ))}
                </tbody>
            </table>

            <TicketModal
                ticket={selectedTicket}
                onTicketUpdated={onTicketUpdated}
                onCloseModal={() => {
                    setModalVisible(false);
                    setSelectedTicket(null);
                }}
            />
        </div>
    );
}

TicketsTable.propTypes = {
    tickets: PropTypes.array.isRequired,
    onTicketUpdated: PropTypes.func.isRequired,
};

export default TicketsTable;
