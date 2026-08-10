from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Zuhayr-Huseni-Resume.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

INK = HexColor("#111A22")
SLATE = HexColor("#596974")
SIGNAL = HexColor("#147A96")
LINE = HexColor("#CCD0CE")

styles = getSampleStyleSheet()
name_style = ParagraphStyle(
    "Name",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=24,
    leading=24,
    textColor=INK,
    spaceAfter=2,
)
title_style = ParagraphStyle(
    "Title",
    parent=styles["Normal"],
    fontName="Courier",
    fontSize=7.2,
    leading=9,
    textColor=SIGNAL,
    uppercase=True,
)
contact_style = ParagraphStyle(
    "Contact",
    parent=styles["Normal"],
    fontName="Courier",
    fontSize=6.9,
    leading=9,
    textColor=SLATE,
    alignment=TA_RIGHT,
)
section_style = ParagraphStyle(
    "Section",
    parent=styles["Heading2"],
    fontName="Courier-Bold",
    fontSize=7.2,
    leading=9,
    textColor=SIGNAL,
    spaceBefore=6,
    spaceAfter=3,
    uppercase=True,
)
role_style = ParagraphStyle(
    "Role",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8.8,
    leading=10.5,
    textColor=INK,
)
meta_style = ParagraphStyle(
    "Meta",
    parent=styles["Normal"],
    fontName="Courier",
    fontSize=6.3,
    leading=8,
    textColor=SLATE,
    alignment=TA_RIGHT,
)
body_style = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=7.25,
    leading=9.25,
    textColor=INK,
    leftIndent=8,
    firstLineIndent=-6,
    spaceAfter=1.6,
)
compact_style = ParagraphStyle(
    "Compact",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=6.9,
    leading=8.8,
    textColor=INK,
)


def role(company, role, dates, location, bullets):
    story = []
    heading = Table(
        [[Paragraph(f"{role} - {company}", role_style), Paragraph(f"{dates}<br/>{location}", meta_style)]],
        colWidths=[5.55 * inch, 1.55 * inch],
    )
    heading.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
            ]
        )
    )
    story.append(heading)
    for bullet in bullets:
        story.append(Paragraph(f"- {bullet}", body_style))
    story.append(Spacer(1, 2))
    return story


doc = BaseDocTemplate(
    str(OUTPUT),
    pagesize=letter,
    leftMargin=0.48 * inch,
    rightMargin=0.48 * inch,
    topMargin=0.42 * inch,
    bottomMargin=0.38 * inch,
    title="Zuhayr Huseni Resume",
    author="Zuhayr Huseni",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="resume")
doc.addPageTemplates([PageTemplate(id="resume", frames=[frame])])

story = []
header = Table(
    [[
        [Paragraph("Zuhayr Huseni", name_style), Paragraph("SOFTWARE ENGINEER / DISTRIBUTED SYSTEMS", title_style)],
        Paragraph(
            "San Francisco Bay Area<br/>zuhayrhuseni@gmail.com / 978-201-2509<br/>github.com/zuhayrhuseni / linkedin.com/in/zuhayr-huseni<br/>U.S. citizen",
            contact_style,
        ),
    ]],
    colWidths=[4.5 * inch, 2.6 * inch],
)
header.setStyle(
    TableStyle(
        [
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]
    )
)
story.extend([header, Spacer(1, 6), HRFlowable(width="100%", thickness=0.6, color=INK)])

story.append(Paragraph("01 / EXPERIENCE", section_style))
story.extend(role(
    "PayPal",
    "Software engineer",
    "Jul 2025 - present",
    "San Jose, CA",
    [
        "Design and maintain distributed Spring Boot microservices on GCP for PayPal's global Suspicious Activity Report platform, processing transaction, account, and payment data across encrypted pipelines and authenticated service boundaries.",
        "Built a company-wide Claude Code test-data CLI that provisions custom accounts, bank accounts, cards, and identity attributes in minutes instead of relying on cross-team manual setup.",
        "Developed an org-wide agent harness connecting Claude Code and Desktop to protected MCP services; diagnose production incidents with Datadog, Splunk, Oracle SQL, and structured logs.",
    ],
))
story.extend(role(
    "University of Connecticut",
    "Undergraduate researcher - 5G systems",
    "Apr - Sep 2024",
    "Remote",
    [
        "Benchmarked throughput and latency across four open-air interfaces on Linux; scripted traffic generation, node simulation, and log analysis in Python and shell.",
        "Implemented gNodeB-to-UE tunneling and built a C-based real-time latency and throughput visualization with srsGUI.",
    ],
))
story.extend(role(
    "Forms+Surfaces",
    "Full stack software engineer intern",
    "Jun - Aug 2024",
    "Pittsburgh, PA",
    [
        "Shipped a React and Flask application translating natural-language questions into SQL for a Made2Manage ERP database, cutting data-retrieval time by 40%.",
        "Automated SolidWorks and PyFEM design validation, accelerating production timelines by 50% and avoiding about $10,000 in annual prototyping costs.",
    ],
))
story.extend(role(
    "Propel Flow",
    "AI development engineer intern",
    "Feb - Apr 2024",
    "Remote",
    [
        "Deployed Python and TensorFlow inference services on AWS EC2 and Lambda, delivering an estimated $40,000 in annual client savings.",
        "Tuned GPT-4 financial recommendation pipelines and improved MongoDB retrieval through PyMongo indexing.",
    ],
))

story.append(Paragraph("02 / PROJECT", section_style))
story.extend(role(
    "OneStopShopHousing.AI",
    "Full stack engineer",
    "Sep 2024 - May 2025",
    "Personal project",
    [
        "Built scrapers that normalized housing listings into SQLite and an OpenAI-backed natural-language-to-SQL layer; shipped authentication, favorites, comparisons, and commute-time visualization in React and Node.js/Express.",
    ],
))

story.append(Paragraph("03 / EDUCATION", section_style))
education_table = Table(
    [
        [Paragraph("<b>Georgia Institute of Technology</b><br/>M.S. Computer Science - machine learning specialization", compact_style), Paragraph("Started Aug 2026 / expected 2028<br/>OMSCS while working full time", meta_style)],
        [Paragraph("<b>University of Connecticut</b><br/>B.S. Computer Science - GPA 3.76", compact_style), Paragraph("May 2025<br/>Honors Scholar and Laureate", meta_style)],
    ],
    colWidths=[5.55 * inch, 1.55 * inch],
)
education_table.setStyle(
    TableStyle(
        [
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 1),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LINEBELOW", (0, 0), (-1, 0), 0.35, LINE),
        ]
    )
)
story.append(education_table)

story.append(Paragraph("04 / TECHNICAL REGISTER", section_style))
skill_rows = [
    ("Languages", "Python, Java, C/C++, SQL, JavaScript, Bash"),
    ("Cloud + backend", "GCP, AWS, Kubernetes, Docker, Spring Boot, Flask, Node.js/Express, REST microservices"),
    ("Observe + test", "Datadog, Splunk, JUnit, WireMock, structured logging, Git, CI/CD"),
    ("Data + ML", "Oracle SQL, MongoDB, DynamoDB, SQLite, TensorFlow, OpenAI API, MCP servers, Claude Code"),
]
skill_table = Table(
    [[Paragraph(f"<b>{label}</b>", compact_style), Paragraph(values, compact_style)] for label, values in skill_rows],
    colWidths=[1.15 * inch, 5.95 * inch],
)
skill_table.setStyle(
    TableStyle(
        [
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 2.2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2.2),
            ("LINEBELOW", (0, 0), (-1, -2), 0.3, LINE),
        ]
    )
)
story.append(skill_table)

doc.build(story)
print(OUTPUT)
