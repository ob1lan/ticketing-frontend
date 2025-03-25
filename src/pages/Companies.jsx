import { useEffect, useState } from "react";
import { fetchCompanies, createCompany, updateCompany } from "../api";
import { CompanyModal } from "../components/Companies";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");
    const [modalLoading, setModalLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    useEffect(() => {
        loadCompanies(currentPage);
    }, [currentPage]);

    const loadCompanies = (page = 1) => {
        setLoading(true);
        fetchCompanies(page)
            .then((data) => {
                setCompanies(data.results || []);
                setTotalPages(Math.ceil(data.count / 5));
                setNextPage(data.next);
                setPrevPage(data.previous);
            })
            .catch((err) => console.error("Failed to fetch companies", err))
            .finally(() => setLoading(false));
    };

    const handleModalSubmit = async (companyData) => {
        setModalLoading(true);
        setModalError("");
        setModalSuccess("");

        try {
            if (editingCompany) {
                await updateCompany(editingCompany.id, companyData);
                setModalSuccess("Company updated successfully!");
            } else {
                await createCompany(companyData);
                setModalSuccess("Company created successfully!");
            }
            setTimeout(() => {
                setIsModalOpen(false);
                loadCompanies(currentPage);
            }, 1000);
        } catch (err) {
            setModalError(err.message || "Failed to save company.");
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="divider">
                <button
                    className="btn btn-soft btn-primary"
                    onClick={() => {
                        setEditingCompany(null);
                        setIsModalOpen(true);
                    }}
                >
                    New Company
                </button>
            </div>

            {loading ? (
                <div className="skeleton w-full h-32"></div>
            ) : companies.length === 0 ? (
                <div className="alert alert-warning">
                    <span>No companies found. Add one to get started.</span>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto max-w-full">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Logo</th>
                                    <th>Name</th>
                                    <th>Initials</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((company) => (
                                    <tr key={company.id}>
                                        <td>
                                            {company.logo ? (
                                                <div className="avatar">
                                                    <div className="w-10 rounded">
                                                        <img src={company.logo} alt={company.name} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="badge badge-ghost">No Logo</div>
                                            )}
                                        </td>
                                        <td>{company.name}</td>
                                        <td>{company.initials}</td>
                                        <td>
                                            <div className="whitespace-pre-line">{company.address}</div>
                                        </td>
                                        <td>{company.contact_phone || <span className="text-sm text-gray-400">N/A</span>}</td>
                                        <td>
                                            <button
                                                className="btn btn-soft btn-primary btn-xs"
                                                onClick={() => {
                                                    setEditingCompany(company);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ Pagination Controls */}
                    <div className="join p-2 mt-4 justify-center">
                        <button
                            className="join-item btn"
                            disabled={!prevPage}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            «
                        </button>
                        <span className="join-item btn">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="join-item btn"
                            disabled={!nextPage}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            »
                        </button>
                    </div>
                </>
            )}

            <CompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingCompany || {}}
                loading={modalLoading}
                error={modalError}
                success={modalSuccess}
            />
        </div>
    );
}

export default Companies;
