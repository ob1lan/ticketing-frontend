import { useEffect, useState } from "react";
import { fetchCompanies } from "../api";
import { useNavigate } from "react-router-dom";
import { CompanyModal } from "../components/Companies";


function Companies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");
    const [modalLoading, setModalLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies()
            .then((data) => setCompanies(data.results || []))
            .catch((err) => console.error("Failed to fetch companies", err))
            .finally(() => setLoading(false));
    }, []);


    const handleEditClick = (company) => {
        setSelectedCompany(company);
        setIsEditModalOpen(true);
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
                fetchAllCompanies(); // refresh list
            }, 1000);
        } catch (err) {
            setModalError(err.message || "Failed to save company.");
        } finally {
            setModalLoading(false);
        }
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Companies</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingCompany(null); // ensures "create" mode
                        setIsModalOpen(true);
                    }}
                >
                    Create New Company
                </button>

            </div>

            {loading ? (
                <div className="skeleton w-full h-32"></div>
            ) : companies.length === 0 ? (
                <div className="alert alert-warning">
                    <span>No companies found. Add one to get started.</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th>Name</th>
                                <th>Initials</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Actions</th>
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
                                            className="btn btn-sm btn-outline"
                                            onClick={() => {
                                                setEditingCompany(company);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <EditCompanyModal
                company={selectedCompany}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onCompanyUpdated={handleUpdateCompany}
            />
            <CompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingCompany}
                loading={modalLoading}
                error={modalError}
                success={modalSuccess}
            />
        </div>
    );
}

export default Companies;
