import { subDays, subHours } from "date-fns"

export type Classification = "confirmed_outbreak" | "early_signal" | "research"

export interface IntelEvent {
    id: string
    title: string
    summary: string
    publishedAt: string
    sourceName: string
    sourceTier: 1 | 2 | 3
    sourceUrl: string
    confidence: number
    classification: Classification
    diseases: string[]
    locations: {
        country: string
        region?: string
        city?: string
        iso2?: string
    }[]
    caseCount?: number
    deathCount?: number
    assessmentText: string
    tags: string[]
}

const diseasesList = [
    "Ebola Virus Disease", "Cholera", "Mpox", "Dengue", "Nipah Virus",
    "Avian Influenza (H5N1)", "Lassa Fever", "Yellow Fever", "Zika Virus",
    "Marburg Virus", "Oropouche Virus", "Polio", "COVID-19", "Measles"
]

const countriesList = [
    { name: "Democratic Republic of the Congo", iso2: "CD" },
    { name: "Nigeria", iso2: "NG" },
    { name: "Uganda", iso2: "UG" },
    { name: "India", iso2: "IN" },
    { name: "Brazil", iso2: "BR" },
    { name: "Indonesia", iso2: "ID" },
    { name: "Sudan", iso2: "SD" },
    { name: "China", iso2: "CN" },
    { name: "Vietnam", iso2: "VN" },
    { name: "Kenya", iso2: "KE" }
]

const sources = [
    { name: "WHO DONs", tier: 1 },
    { name: "CDC Emergency", tier: 1 },
    { name: "ECDC Weekly", tier: 2 },
    { name: "MoHFW India", tier: 1 },
    { name: "BlueDot Analytics", tier: 3 },
    { name: "ProMED-mail", tier: 2 }
]

export function generateMockEvents(count: number = 100): IntelEvent[] {
    return Array.from({ length: count }).map((_, i) => {
        const classification: Classification = i === 0
            ? "confirmed_outbreak"
            : i === 1
                ? "early_signal"
                : i % 10 === 0 ? "confirmed_outbreak" : i % 5 === 0 ? "early_signal" : "research"

        const disease = diseasesList[Math.floor(Math.random() * diseasesList.length)]
        const country = countriesList[Math.floor(Math.random() * countriesList.length)]
        const source = sources[Math.floor(Math.random() * sources.length)]
        const date = subHours(subDays(new Date(), Math.floor(i / 3)), i % 24)

        const confidence = classification === "confirmed_outbreak"
            ? 0.9 + Math.random() * 0.1
            : classification === "early_signal"
                ? 0.4 + Math.random() * 0.4
                : 0.7 + Math.random() * 0.2

        return {
            id: `evt-${i}`,
            title: `${disease} detected in ${country.name}${classification === "early_signal" ? " - Preliminary Report" : ""}`,
            summary: `Surveillance systems identified matching symptoms for ${disease} in ${country.name}. Local health authorities are monitoring the situation.`,
            publishedAt: date.toISOString(),
            sourceName: source.name,
            sourceTier: source.tier as 1 | 2 | 3,
            sourceUrl: "https://www.who.int/emergencies/disease-outbreak-news",
            confidence,
            classification,
            diseases: [disease],
            locations: [{ country: country.name, iso2: country.iso2 }],
            caseCount: classification === "confirmed_outbreak" ? Math.floor(Math.random() * 500) : undefined,
            deathCount: classification === "confirmed_outbreak" ? Math.floor(Math.random() * 50) : undefined,
            assessmentText: classification === "confirmed_outbreak"
                ? "Confirmed via clinical testing and official reporting."
                : "Automated analysis detected keyword clusters in social and local news feeds.",
            tags: [disease, country.name, source.name]
        }
    })
}

export const MOCK_EVENTS = generateMockEvents(100)
