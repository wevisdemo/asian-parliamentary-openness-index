PARLIAMENT_TYPE_COLUMN = "Is the Parliament unicameral or bicameral?"
TEMPLATE_SHEET_LINK = "https://docs.google.com/spreadsheets/d/1udHPvoDQKQ9_ziyqwTObWgI1dEKTVLnm/edit?gid=1895687088#gid=1895687088"

COUNTRIES_DEFAULT_COLUMNS = [
    PARLIAMENT_TYPE_COLUMN,
    "Any remark for unicameral or bicamera?",
    "How is the system of government classified in this jurisdiction?",
    "What is the name of the Parliament you will be assessing?",
    "Provide the link to the Parliament’s official website",
    "Key findings",
]

RESPONDENTS_DEFAULT_COLUMNS = [
    "Name of respondent",
    "Email of respondent to correspond with",
    "Representative Parliament Monitoring Organization (PMO) of respondent",
    "Years of experience of parliament monitoring by the organization",
    "About the Respondent",
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
]

INDICATOR_CONTEXTS_DEFAULT_COLUMNS = [
    "Country",
    "Chamber",
    "Indicator Number",
    "Context",
    "Evidences",
]
