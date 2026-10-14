PARLIAMENT_TYPE_COLUMN = "Is the Parliament unicameral or bicameral?"

COUNTRIES_DEFAULT_COLUMNS = [
    PARLIAMENT_TYPE_COLUMN,
    "How is the system of government classified in this jurisdiction?",
    "What is the name of the Parliament you will be assessing?",
    "Provide the link to the Parliament’s official website",
    "Key findings of the Parliament assessment as relayed by the PMO (Use 200 words maximum)",
    "Date assessment was sent to Parliament (YYYY-MM-DD)",
]

EXPERIENCE_COLUMN = """In what year did the organization begin monitoring Parliament? 
Please provide the starting year (e.g., 2026). If not applicable, answer “Not applicable.”"""

RESPONDENTS_DEFAULT_COLUMNS = [
    "Name/s of respondent/s",
    "Email/s of respondent/s to correspond with",
    "Representative Parliament Monitoring Organization (PMO) of respondent",
    """In what year did the organization begin monitoring Parliament? 
Please provide the starting year (e.g., 2026). If not applicable, answer “Not applicable.”""",
    "Introduction of the PMO (Use 100 words maximum)",
]

INDICATORS_DEFAULT_COLUMNS = [
    "Section Name",
    "Dimension",
    "Dimension Relevance",
    "Section",
]

INDICATORS_TRANSFORM_COLUMNS = [
    "Dimension",
    "Dimension Relevance",
    "Indicator Number",
    "Indicator",
]

QUESTIONS_TRANSFORM_COLUMNS = [
    "Indicator Number",
    "Question Number",
    "Question",
    "Answer Type",
    "Answer Options",
]

ANSWERS_TRANSFORM_COLUMNS = [
    "Country",
    "Chamber",
    "Question Number",
    "Answer",
    "Score",
    "Total Applicable Score",
    "Context",
    "Evidences",
]
