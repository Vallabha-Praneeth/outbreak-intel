export const MOCK_EVENTS = [
    {
        id: '1',
        title: 'Sudan virus disease – Uganda',
        published_at: '2025-02-01T10:10:31Z',
        diseases: ['Ebola'],
        locations: ['Uganda', 'Sudan'],
        signal_classification: 'confirmed_outbreak',
        confidence_score: 1.0,
        assessment_text: 'Official Tier 1 Source (WHO DONs)',
        raw_url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2025-DON512'
    },
    {
        id: '2',
        title: 'Mpox - Multi-country outbreak',
        published_at: '2024-12-15T08:00:00Z',
        diseases: ['Mpox'],
        locations: ['DRC', 'Nigeria', 'Kenya'],
        signal_classification: 'confirmed_outbreak',
        confidence_score: 0.95,
        assessment_text: 'Escalating case counts in multiple regions.',
        raw_url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2024-DON500'
    },
    {
        id: '3',
        title: 'Undisclosed Respiratory Illness in Northern Region',
        published_at: '2024-03-10T14:30:00Z',
        diseases: [],
        locations: ['China'],
        signal_classification: 'early_signal',
        confidence_score: 0.6,
        assessment_text: 'Unofficial reports of hospital surges detected via social monitoring.',
        raw_url: '#'
    }
];
