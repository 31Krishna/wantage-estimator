import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MATERIAL_LABELS = {
    asphalt_3tab: "3-Tab Asphalt",
    asphalt_arch: "Architectural",
    metal_standing: "Standing Seam Metal",
    cedar_shake: "Cedar Shake",
};

const PITCH_LABELS = {
    low: "Low",
    medium: "Medium",
    steep: "Steep",
};

const LAYER_LABELS = {
    0: "None",
    1: "One Layer",
    2: "Two or More Layers",
};

const STORIES_LABELS = {
    1: "Single Storey",
    2: "Two Storeys",
    3: "Three or More",
};

function AdminDashboard() {
    const [leads, setLeads] = useState([]);
    const [config, setConfig] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [materialFilter, setMaterialFilter] = useState("all");
    const [configFilter, setConfigFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("latest");

    const [selectedLead, setSelectedLead] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);

    const leadsPerPage = 5;

    
    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found. Please login.");
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [leadsResponse, configResponse] = await Promise.all([
                axios.get(`${API_URL}/leads/admin`, {
                    headers,
                }),

                axios.get(`${API_URL}/admin/config`, {
                    headers,
                }),
            ]);

            setLeads(leadsResponse.data.leads || []);
            setConfig(configResponse.data || null);

            console.log("Leads:", leadsResponse.data);
            console.log("Configuration:", configResponse.data);
        } catch (err) {
            console.error("Failed to fetch dashboard:", err);

            if (err.response?.status === 401) {
                setError("Session expired. Please login again.");
            } else if (err.response?.status === 403) {
                setError("You do not have permission to access this dashboard.");
            } else {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load dashboard data."
                );
            }

            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    

    useEffect(() => {
        fetchDashboard();
    }, []);

    
    useEffect(() => {
        setCurrentPage(1);
    }, [search, materialFilter, configFilter, sortOrder]);



    const filteredLeads = useMemo(() => {
        let result = [...leads];

        
        if (search.trim()) {
            const query = search.toLowerCase().trim();

            result = result.filter((lead) => {
                return (
                    lead.name?.toLowerCase().includes(query) ||
                    lead.email?.toLowerCase().includes(query) ||
                    lead.phone?.toLowerCase().includes(query) ||
                    lead.address?.toLowerCase().includes(query)
                );
            });
        }

       
        if (materialFilter !== "all") {
            result = result.filter(
                (lead) => lead.answers?.material === materialFilter
            );
        }

        
        if (configFilter !== "all") {
            result = result.filter(
                (lead) => String(lead.config_version) === String(configFilter)
            );
        }

        
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            if (sortOrder === "latest") {
                return dateB - dateA;
            }

            return dateA - dateB;
        });

        return result;
    }, [
        leads,
        search,
        materialFilter,
        configFilter,
        sortOrder,
    ]);

    
    const totalPages = Math.ceil(
        filteredLeads.length / leadsPerPage
    );

    const startIndex = (currentPage - 1) * leadsPerPage;

    const paginatedLeads = filteredLeads.slice(
        startIndex,
        startIndex + leadsPerPage
    );
    const navigate = useNavigate();




  

    const totalLeads = leads.length;

    const averageEstimate = useMemo(() => {
        if (!leads.length) return 0;

        const total = leads.reduce((sum, lead) => {
            const low = Number(lead.estimate?.low || lead.estimate_low || 0);
            const high = Number(
                lead.estimate?.high || lead.estimate_high || 0
            );

            const average = (low + high) / 2;

            return sum + average;
        }, 0);

        return Math.round(total / leads.length);
    }, [leads]);

    

    const configVersions = useMemo(() => {
        return [...new Set(leads.map((lead) => lead.config_version))]
            .filter(Boolean)
            .sort((a, b) => b - a);
    }, [leads]);

    

    const materials = useMemo(() => {
        return [
            ...new Set(
                leads
                    .map((lead) => lead.answers?.material)
                    .filter(Boolean)
            ),
        ];
    }, [leads]);

    
    const clearFilters = () => {
        setSearch("");
        setMaterialFilter("all");
        setConfigFilter("all");
        setSortOrder("latest");
        setCurrentPage(1);
    };

    const hasFilters =
        search ||
        materialFilter !== "all" ||
        configFilter !== "all" ||
        sortOrder !== "latest";

    
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

   
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };
   
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

                        <h2 className="text-xl font-semibold">
                            Loading dashboard...
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Fetching customer leads and configuration
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    
    if (error && !leads.length) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="flex min-h-screen items-center justify-center px-6">
                    <div className="w-full max-w-md rounded-2xl border border-red-900/50 bg-slate-900 p-8 text-center shadow-xl">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl">
                            ⚠️
                        </div>

                        <h2 className="text-2xl font-bold">
                            Unable to load dashboard
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            {error}
                        </p>

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={fetchDashboard}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-500"
                            >
                                Try Again
                            </button>

                            {error.includes("Session") && (
                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium text-slate-300 transition hover:bg-slate-800"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* HEADER */}
            <header className="border-b border-slate-800 bg-slate-900/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Northline Admin
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Roofing Management Dashboard
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={fetchDashboard}
                            disabled={loading}
                            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                        >
                            {loading ? "Refreshing..." : "↻ Refresh"}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500/20"
                        >
                            Logout
                        </button>

                    </div>

                </div>
            </header>

            {/* MAIN */}
            <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
                {/* ERROR BANNER */}
                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-red-900/50 bg-red-950/30 px-5 py-4">
                        <div>
                            <p className="font-semibold text-red-300">
                                Dashboard warning
                            </p>

                            <p className="mt-1 text-sm text-red-400">
                                {error}
                            </p>
                        </div>

                        <button
                            onClick={fetchDashboard}
                            className="rounded-lg border border-red-800 px-4 py-2 text-sm text-red-300 hover:bg-red-900/30"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* STATS */}
                <section className="grid gap-5 md:grid-cols-3">
                    {/* TOTAL LEADS */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">
                                    Total Leads
                                </p>

                                <h2 className="mt-4 text-4xl font-bold">
                                    {totalLeads}
                                </h2>

                                <p className="mt-3 text-sm text-slate-500">
                                    Customer requests
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                                👥
                            </div>
                        </div>
                    </div>

                    {/* AVERAGE ESTIMATE */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">
                                    Average Estimate
                                </p>

                                <h2 className="mt-4 text-4xl font-bold">
                                    {formatCurrency(averageEstimate)}
                                </h2>

                                <p className="mt-3 text-sm text-slate-500">
                                    Across all leads
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-400">
                                $
                            </div>
                        </div>
                    </div>

                    {/* CONFIG */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">
                                    Latest Configuration
                                </p>

                                <h2 className="mt-4 text-4xl font-bold">
                                    v{config?.config_version || "-"}
                                </h2>

                                <p className="mt-3 text-sm text-slate-500">
                                    Active configuration
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                                ⚙️
                            </div>
                        </div>
                    </div>
                </section>

                {/* LEADS SECTION */}
                <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
                    {/* SECTION HEADER */}
                    <div className="border-b border-slate-800 p-6 sm:p-7">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold">
                                        Customer Leads
                                    </h2>

                                    <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                                        {filteredLeads.length}{" "}
                                        {filteredLeads.length === 1
                                            ? "Lead"
                                            : "Leads"}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-slate-400">
                                    All submitted roofing estimate requests
                                </p>
                            </div>

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* FILTERS */}
                        <div className="mt-6 grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                            {/* SEARCH */}
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    🔎
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search name, email, phone..."
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-11 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* MATERIAL */}
                            <select
                                value={materialFilter}
                                onChange={(e) =>
                                    setMaterialFilter(e.target.value)
                                }
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-blue-500"
                            >
                                <option value="all">All Materials</option>

                                {materials.map((material) => (
                                    <option key={material} value={material}>
                                        {MATERIAL_LABELS[material] ||
                                            material}
                                    </option>
                                ))}
                            </select>

                            {/* CONFIG */}
                            <select
                                value={configFilter}
                                onChange={(e) =>
                                    setConfigFilter(e.target.value)
                                }
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-blue-500"
                            >
                                <option value="all">
                                    All Configurations
                                </option>

                                {configVersions.map((version) => (
                                    <option
                                        key={version}
                                        value={version}
                                    >
                                        Configuration v{version}
                                    </option>
                                ))}
                            </select>

                            {/* SORT */}
                            <select
                                value={sortOrder}
                                onChange={(e) =>
                                    setSortOrder(e.target.value)
                                }
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-blue-500"
                            >
                                <option value="latest">
                                    Latest First
                                </option>

                                <option value="oldest">
                                    Oldest First
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* TABLE */}
                    {paginatedLeads.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[950px]">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-800/70 text-left">
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Contact
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Roof
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Estimate
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Config
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Date
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedLeads.map((lead) => {
                                        const low = Number(
                                            lead.estimate?.low ||
                                            lead.estimate_low ||
                                            0
                                        );

                                        const high = Number(
                                            lead.estimate?.high ||
                                            lead.estimate_high ||
                                            0
                                        );

                                        const material =
                                            lead.answers?.material;

                                        return (
                                            <tr
                                                key={lead._id}
                                                onClick={() =>
                                                    setSelectedLead(lead)
                                                }
                                                className="cursor-pointer border-b border-slate-800 transition hover:bg-slate-800/50"
                                            >
                                                {/* CUSTOMER */}
                                                <td className="px-6 py-5">
                                                    <p className="font-semibold text-white">
                                                        {lead.name}
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {lead.address ||
                                                            "Address not provided"}
                                                    </p>
                                                </td>

                                                {/* CONTACT */}
                                                <td className="px-6 py-5">
                                                    <p className="text-sm text-slate-200">
                                                        {lead.email}
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {lead.phone}
                                                    </p>
                                                </td>

                                                {/* ROOF */}
                                                <td className="px-6 py-5">
                                                    <p className="font-semibold text-white">
                                                        {Number(
                                                            lead.answers?.roof_area || 0
                                                        ).toLocaleString()}{" "}
                                                        sq ft
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {MATERIAL_LABELS[material] ||
                                                            material ||
                                                            "-"}
                                                    </p>
                                                </td>

                                                {/* ESTIMATE */}
                                                <td className="px-6 py-5">
                                                    <p className="font-semibold text-emerald-400">
                                                        {formatCurrency(low)}
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        to {formatCurrency(high)}
                                                    </p>
                                                </td>

                                                {/* CONFIG */}
                                                <td className="px-6 py-5">
                                                    <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                                                        v{lead.config_version}
                                                    </span>
                                                </td>

                                                {/* DATE */}
                                                <td className="px-6 py-5 text-sm text-slate-400">
                                                    {formatDate(lead.createdAt)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl">
                                🔍
                            </div>

                            <h3 className="mt-5 text-lg font-semibold">
                                No leads found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Try changing your search or filters.
                            </p>

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 px-6 py-5 sm:flex-row">
                            <p className="text-sm text-slate-500">
                                Showing{" "}
                                <span className="text-slate-300">
                                    {startIndex + 1}
                                </span>{" "}
                                to{" "}
                                <span className="text-slate-300">
                                    {Math.min(
                                        startIndex + leadsPerPage,
                                        filteredLeads.length
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="text-slate-300">
                                    {filteredLeads.length}
                                </span>{" "}
                                leads
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(page - 1, 1)
                                        )
                                    }
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ← Previous
                                </button>

                                <span className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300">
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(page + 1, totalPages)
                                        )
                                    }
                                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* CUSTOMER DETAIL MODAL */}
            {selectedLead && (
                <CustomerDetailsModal
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
}



function CustomerDetailsModal({
    lead,
    onClose,
    formatCurrency,
    formatDate,
}) {
    const answers = lead.answers || {};

    const low = Number(
        lead.estimate?.low || lead.estimate_low || 0
    );

    const high = Number(
        lead.estimate?.high || lead.estimate_high || 0
    );

    const material =
        MATERIAL_LABELS[answers.material] ||
        answers.material ||
        "-";

    const pitch =
        PITCH_LABELS[answers.pitch] ||
        answers.pitch ||
        "-";

    const layers =
        LAYER_LABELS[answers.layers] ||
        answers.layers ||
        "-";

    const stories =
        STORIES_LABELS[answers.stories] ||
        answers.stories ||
        "-";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            >
                {/* MODAL HEADER */}
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-800 bg-slate-900 px-6 py-6 sm:px-8">
                    <div>
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Customer Details
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Lead ID: {lead._id}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-2xl text-slate-400 transition hover:bg-slate-700 hover:text-white"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-8 p-6 sm:p-8">
                    {/* CUSTOMER INFORMATION */}
                    <div>
                        <SectionTitle
                            icon="👤"
                            title="Contact Details"
                            subtitle="Customer information"
                        />

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <DetailCard
                                label="Name"
                                value={lead.name}
                            />

                            <DetailCard
                                label="Email"
                                value={lead.email}
                            />

                            <DetailCard
                                label="Phone"
                                value={lead.phone}
                            />

                            <DetailCard
                                label="Address"
                                value={lead.address || "Not provided"}
                            />
                        </div>
                    </div>

                    {/* ROOF DETAILS */}
                    <div>
                        <SectionTitle
                            icon="🏠"
                            title="Roofing Details"
                            subtitle="Customer requirements"
                        />

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <DetailCard
                                label="Roof Area"
                                value={`${Number(
                                    answers.roof_area || 0
                                ).toLocaleString()} sq ft`}
                            />

                            <DetailCard
                                label="Material"
                                value={material}
                            />

                            <DetailCard
                                label="Roof Pitch"
                                value={pitch}
                            />

                            <DetailCard
                                label="Existing Layers"
                                value={layers}
                            />

                            <DetailCard
                                label="Stories"
                                value={stories}
                            />
                        </div>
                    </div>

                    {/* ESTIMATE */}
                    <div>
                        <SectionTitle
                            icon="$"
                            title="Estimate"
                            subtitle="Estimated roofing cost"
                        />

                        <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
                            <p className="text-sm text-slate-400">
                                Estimated Cost Range
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <span className="text-3xl font-bold text-emerald-400 sm:text-4xl">
                                    {formatCurrency(low)}
                                </span>

                                <span className="text-slate-500">
                                    to
                                </span>

                                <span className="text-3xl font-bold text-emerald-400 sm:text-4xl">
                                    {formatCurrency(high)}
                                </span>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <span className="rounded-full bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400">
                                    Configuration v
                                    {lead.config_version}
                                </span>

                                <span className="rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-400">
                                    Submitted{" "}
                                    {formatDate(lead.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* TIMESTAMPS */}
                    <div className="border-t border-slate-800 pt-6">
                        <p className="text-sm text-slate-500">
                            Created:{" "}
                            {lead.createdAt
                                ? new Date(
                                    lead.createdAt
                                ).toLocaleString()
                                : "-"}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Updated:{" "}
                            {lead.updatedAt
                                ? new Date(
                                    lead.updatedAt
                                ).toLocaleString()
                                : "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================================================
// SECTION TITLE
// ==================================================

function SectionTitle({
    icon,
    title,
    subtitle,
}) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-lg text-blue-400">
                {icon}
            </div>

            <div>
                <h3 className="text-lg font-bold">
                    {title}
                </h3>

                <p className="text-sm text-slate-500">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}


function DetailCard({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {label}
            </p>

            <p className="mt-3 break-words text-base font-semibold text-white">
                {value || "-"}
            </p>
        </div>
    );
}

export default AdminDashboard;