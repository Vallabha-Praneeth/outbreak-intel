/**
 * External data source integrations for outbreak intelligence
 * CDC, ProMED, WHO, and other health organization APIs
 */

export type DataSource = {
    id: string
    name: string
    description: string
    url: string
    type: "api" | "rss" | "scrape"
    status: "active" | "inactive" | "error"
    lastSync: string | null
    recordCount: number
}

export type CDCOutbreak = {
    id: string
    title: string
    disease: string
    location: string
    caseCount: number
    dateReported: string
    status: "active" | "resolved" | "monitoring"
    source: "cdc"
    url: string
}

export type ProMEDAlert = {
    id: string
    title: string
    diseases: string[]
    locations: string[]
    publishDate: string
    summary: string
    archiveNumber: string
    source: "promed"
    url: string
}

export type WHOAlert = {
    id: string
    title: string
    diseaseOutbreakNews: boolean
    emergencyType: string
    countries: string[]
    publishDate: string
    source: "who"
    url: string
}

// Mock data for CDC outbreaks (in production, this would fetch from CDC API)
export async function fetchCDCOutbreaks(): Promise<CDCOutbreak[]> {
    // Simulated CDC data
    return [
        {
            id: "cdc-2024-001",
            title: "Multistate E. coli O157:H7 Outbreak",
            disease: "E. coli",
            location: "United States (Multiple States)",
            caseCount: 47,
            dateReported: new Date().toISOString(),
            status: "active",
            source: "cdc",
            url: "https://www.cdc.gov/ecoli/outbreaks/index.html",
        },
        {
            id: "cdc-2024-002",
            title: "Salmonella Outbreak Linked to Poultry",
            disease: "Salmonella",
            location: "United States",
            caseCount: 89,
            dateReported: new Date(Date.now() - 86400000 * 3).toISOString(),
            status: "active",
            source: "cdc",
            url: "https://www.cdc.gov/salmonella/outbreaks/index.html",
        },
        {
            id: "cdc-2024-003",
            title: "Listeria Outbreak Investigation",
            disease: "Listeria",
            location: "Eastern United States",
            caseCount: 12,
            dateReported: new Date(Date.now() - 86400000 * 7).toISOString(),
            status: "monitoring",
            source: "cdc",
            url: "https://www.cdc.gov/listeria/outbreaks/index.html",
        },
    ]
}

// Mock data for ProMED alerts (in production, this would fetch from ProMED API)
export async function fetchProMEDAlerts(): Promise<ProMEDAlert[]> {
    return [
        {
            id: "promed-20240115001",
            title: "Avian Influenza (H5N1) - Southeast Asia",
            diseases: ["Avian Influenza", "H5N1"],
            locations: ["Vietnam", "Thailand", "Cambodia"],
            publishDate: new Date().toISOString(),
            summary: "Increased H5N1 activity reported in poultry farms across Southeast Asia with potential human exposure cases under investigation.",
            archiveNumber: "20240115.8901234",
            source: "promed",
            url: "https://promedmail.org/",
        },
        {
            id: "promed-20240114002",
            title: "Dengue Fever Surge - South America",
            diseases: ["Dengue"],
            locations: ["Brazil", "Argentina", "Paraguay"],
            publishDate: new Date(Date.now() - 86400000).toISOString(),
            summary: "Significant increase in dengue cases reported across South American countries, with hospitals reporting capacity strain.",
            archiveNumber: "20240114.8900123",
            source: "promed",
            url: "https://promedmail.org/",
        },
        {
            id: "promed-20240112003",
            title: "Mpox Cases - Central Africa",
            diseases: ["Mpox", "Monkeypox"],
            locations: ["Democratic Republic of Congo", "Central African Republic"],
            publishDate: new Date(Date.now() - 86400000 * 3).toISOString(),
            summary: "Continued mpox transmission in Central African regions with new clade variant detected.",
            archiveNumber: "20240112.8899012",
            source: "promed",
            url: "https://promedmail.org/",
        },
    ]
}

// Mock data for WHO alerts
export async function fetchWHOAlerts(): Promise<WHOAlert[]> {
    return [
        {
            id: "who-2024-dons-001",
            title: "Multi-country outbreak of cholera",
            diseaseOutbreakNews: true,
            emergencyType: "Grade 3",
            countries: ["Afghanistan", "Pakistan", "Syria", "Somalia"],
            publishDate: new Date(Date.now() - 86400000 * 2).toISOString(),
            source: "who",
            url: "https://www.who.int/emergencies/disease-outbreak-news",
        },
        {
            id: "who-2024-dons-002",
            title: "Marburg virus disease - Equatorial Guinea",
            diseaseOutbreakNews: true,
            emergencyType: "Grade 2",
            countries: ["Equatorial Guinea", "Tanzania"],
            publishDate: new Date(Date.now() - 86400000 * 5).toISOString(),
            source: "who",
            url: "https://www.who.int/emergencies/disease-outbreak-news",
        },
    ]
}

// Get all data sources status
export function getDataSources(): DataSource[] {
    return [
        {
            id: "cdc",
            name: "CDC Outbreak Network",
            description: "U.S. Centers for Disease Control outbreak surveillance data",
            url: "https://www.cdc.gov/outbreaks/index.html",
            type: "api",
            status: "active",
            lastSync: new Date().toISOString(),
            recordCount: 156,
        },
        {
            id: "promed",
            name: "ProMED-mail",
            description: "International Society for Infectious Diseases reporting system",
            url: "https://promedmail.org",
            type: "rss",
            status: "active",
            lastSync: new Date(Date.now() - 3600000).toISOString(),
            recordCount: 2847,
        },
        {
            id: "who",
            name: "WHO Disease Outbreak News",
            description: "World Health Organization official disease outbreak notifications",
            url: "https://www.who.int/emergencies/disease-outbreak-news",
            type: "api",
            status: "active",
            lastSync: new Date(Date.now() - 7200000).toISOString(),
            recordCount: 423,
        },
        {
            id: "gphin",
            name: "GPHIN",
            description: "Global Public Health Intelligence Network (Canada)",
            url: "https://gphin.canada.ca",
            type: "api",
            status: "inactive",
            lastSync: null,
            recordCount: 0,
        },
        {
            id: "ecdc",
            name: "ECDC Surveillance",
            description: "European Centre for Disease Prevention and Control",
            url: "https://www.ecdc.europa.eu",
            type: "api",
            status: "active",
            lastSync: new Date(Date.now() - 14400000).toISOString(),
            recordCount: 312,
        },
    ]
}
