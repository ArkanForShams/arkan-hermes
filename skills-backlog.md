# Skills Backlog — Parked (Idea-Handling Rule)

Source: Shams's consolidated Agent Skills Knowledge Base (2026-09-24).
10 priority skills BUILT (see below). These remain parked; build on demand when a real task needs them.
Rule: build a skill when a recurring task demands it, not speculatively.

## Already Built (2026-09-24) — ~/.hermes/skills/
- leadership/caio-advisor, leadership/cto-advisor, leadership/executive-coach
- ai-engineering/ai-architect, ai-governance, prompt-engineer
- ai-engineering/fabric-architect, powerbi-architect, dax-expert, research-agent

## Parked — fold into existing skills first (extend, don't sibling)
- Planner / MemoryManager / ToolOrchestrator -> ai-architect (orchestration patterns) + hermes-agent skill
- PlannerAgent / CriticAgent / ReviewerAgent / ExecutorAgent -> ai-architect generator-critic patterns
- ReasoningCoach / DeepThinker / PromptOptimizer -> prompt-engineer
- PowerBIGovernance / PowerBISecurity / PowerBIPerformance -> powerbi-architect
- FabricEngineer / FabricDataScientist -> fabric-architect
- DataModeler / KPIAdvisor -> dax-expert
- EnterpriseArchitect / StrategyAdvisor -> cto-advisor
- ResponsibleAIAdvisor / AIOperatingModelDesigner / AIPortfolioManager -> ai-governance / caio-advisor

## Parked — genuinely new skills (build when a task demands)
- InvestmentAdvisor / WealthPlanner / FinancialAnalyst (FinGPT-based) — MUST be framed Shariah-compliant (riba-free screening, no speculative instruments); source from AI4Finance-Foundation/FinGPT
- KPIArchitect / DecisionSupport (awesome-business-intelligence)
- MCPArchitect / IntegrationEngineer / KnowledgeConnector (punkpeye/awesome-mcp-servers)
- AITransformationLeader / AIInvestmentAdvisor / AgentStrategyAdvisor (CAIO family)
- InnovationLeader / PlatformArchitect / EngineeringManager / DigitalTransformationAdvisor / VendorAssessmentAdvisor / TechnologyRoadmapPlanner (CTO family)
- StrategicThinker, ProductManager, BusinessAnalyst (crewAI role patterns)
- MeetingAssistant — covered today by meeting-action-items + teams-meeting-pipeline; revisit only if gaps appear



## Wave 2 (2026-09-24, later same day) — PMO + Engineering knowledge bases
Built 23 more skills:
- pmo/ (13): pmo-advisor, portfolio-manager, program-manager, risk-manager, pmo-reporting, executive-reporting, ai-portfolio-advisor, executive-briefing-ai, budget-manager, change-management-advisor, technology-portfolio-advisor, digital-transformation-advisor, stakeholder-advisor
- engineering/ (15): dotnet-architect, aspnetcore-expert, efcore-expert, api-design-expert, react-architect, sqlserver-architect, performance-tuning-advisor, security-architect, solution-architect, azure-architect, devops-architect, ai-coding-advisor, code-review-expert, technical-debt-advisor, engineering-leadership

Total custom skills: 38 (wave 3 added efcore-expert, code-review-expert, technical-debt-advisor, engineering-leadership).

## Parked — PMO KB (build on demand)
- PMOCoordinator, DeliveryLead, ReleaseManager, ResourceManager, DemandManager, CapacityPlanner, PrioritizationAdvisor, StrategicAlignmentAdvisor -> fold into program-manager/portfolio-manager as sections when needed
- PMOCopilot, RAIDAnalystAI, RiskPredictionAI, ProjectHealthAI -> fold into executive-briefing-ai + risk-manager (AI patterns already proceduralized there)
- GovernanceOfficer, ComplianceAdvisor, AuditCoordinator -> fold into ai-governance + pmo-advisor
- InvestmentReviewAdvisor, BenefitsRealizationAdvisor, CostOptimizationAdvisor, PortfolioFinanceAdvisor -> fold into budget-manager
- AgileCoach, ScrumMaster, KanbanAdvisor, LeanTransformation, SAFEConsultant, ReleaseTrainEngineer, EnterpriseAgileCoach, PortfolioGovernance -> one consolidated agile-coach skill IF agile delivery work becomes recurring
- KPIArchitect, OKRAdvisor, PMOMetricsAdvisor, PerformanceManagementAdvisor -> covered by pmo-reporting metric dictionary; extend there
- InnovationGovernance, StrategicExecutionAdvisor, AITransformationLeader -> fold into caio-advisor/digital-transformation-advisor

## Parked — Engineering KB (build on demand)
- IdentitySecurityAdvisor -> folded into security-architect (design) + aspnetcore-expert (implementation)
- AspNetCoreExpert -> BUILT 2026-09-24 as engineering/aspnetcore-expert (promoted from fold on Shams's request)
- CleanArchitectureAdvisor -> folded into dotnet-architect (procedure 1-2)
- ReactDeveloper, FrontendArchitect, UIUXAdvisor, ReactPerformanceExpert -> folded into react-architect (+ frontend-design skill for visual work)
- TSQLExpert, DatabaseAdministrator, DatabaseSecurityExpert -> folded into sqlserver-architect + security-architect
- EFCoreExpert -> BUILT 2026-09-24 as engineering/efcore-expert (promoted from fold)
- CodeReviewExpert -> BUILT as engineering/code-review-expert
- TechnicalDebtAdvisor -> BUILT as engineering/technical-debt-advisor
- TechnicalLead, EngineeringManager, SoftwareDeliveryAdvisor -> BUILT as engineering/engineering-leadership
- EnterpriseArchitect, SystemsArchitect, CloudArchitect -> covered by solution-architect + technology-portfolio-advisor + azure-architect
- PlatformArchitect, InfrastructureAdvisor, CloudEngineer -> fold into azure-architect
- CICDAdvisor, AutomationEngineer, GitHubActionsExpert -> folded into devops-architect
- OWASPAdvisor, ApplicationSecurityAdvisor, IdentitySecurityExpert -> folded into security-architect
- DataArchitect, DataEngineer, DataWarehouseExpert, BusinessIntelligenceAdvisor -> fold into fabric-architect + sqlserver-architect
- CopilotAdvisor -> folded into ai-coding-advisor; AIDesignPatterns -> folded into ai-architect
- AgentDeveloper -> already covered by ai-architect (agent design patterns)

## Knowledge folders (from the proposed HermesAgentHub structure)
Treat ~/hermes-workspace/knowledge/ as the reference library (AI, PowerBI, Fabric, Architecture, Leadership, Wealth, Strategy) — feed from source repos on demand, not bulk-cloned.


## Wave 4 (2026-09-24) — Wealth + final consolidations
Built 4 skills, resolving the last major backlog groups:
- wealth/ (2): wealth-advisor (Shariah-compliant planning, foundation-first), shariah-screening (AAOIFI-style screening records; verdicts belong to scholars, never ARKAN)
- pmo/agile-coach (1): consolidated Scrum/Kanban/lean/scaled coordination (replaces AgileCoach, ScrumMaster, KanbanAdvisor, LeanTransformation, SAFEConsultant, ReleaseTrainEngineer, EnterpriseAgileCoach, PortfolioGovernance backlog items)
- ai-engineering/mcp-integration-architect (1): MCP server design, tool safety classification, credential scoping (resolves MCPArchitect, IntegrationEngineer, KnowledgeConnector items)

## Remaining parked items — ALL fold into built skills (no standalone builds left planned)
- InvestmentReviewAdvisor, BenefitsRealizationAdvisor, CostOptimizationAdvisor, PortfolioFinanceAdvisor -> budget-manager / wealth-advisor
- PMOCopilot, RAIDAnalystAI, RiskPredictionAI, ProjectHealthAI -> executive-briefing-ai + risk-manager
- GovernanceOfficer, ComplianceAdvisor, AuditCoordinator -> ai-governance + pmo-advisor
- PMOCoordinator, DeliveryLead, ReleaseManager, ResourceManager, DemandManager, CapacityPlanner, PrioritizationAdvisor, StrategicAlignmentAdvisor -> program-manager / portfolio-manager
- KPIArchitect, OKRAdvisor, PMOMetricsAdvisor, PerformanceManagementAdvisor -> pmo-reporting
- InnovationGovernance, StrategicExecutionAdvisor, AITransformationLeader -> caio-advisor / digital-transformation-advisor
- DataArchitect, DataEngineer, DataWarehouseExpert, BusinessIntelligenceAdvisor -> fabric-architect / sqlserver-architect
- UIUXAdvisor -> frontend-design skill (visual) / react-architect (structure)
- MeetingIntelligence -> meeting-action-items + teams-meeting-pipeline (existing)

## Status: BACKLOG RESOLVED
Every KB-requested skill is now either BUILT (42) or explicitly FOLDED into a built skill with named destination.
Future rule unchanged: build a new standalone skill only when a real task demands it.


## Wave 5 (2026-09-24) — Presentation stack
Built 4 skills in leadership/:
- presentation-architect (Pyramid Principle, SCQA, MECE, action titles) -> resolves PresentationArchitect + ExecutiveStorytellingAdvisor (one discipline, not two)
- slide-design-expert (one-message slides, chart craft, readability gates) -> resolves SlideDesignExpert
- executive-presenter-coach (notes, scripts, Q&A layers, rehearsal) -> resolves ExecutivePresenterCoach
- cto-caio-presentation-master (end-to-end production flow + domain content sourcing) -> resolves the CTO_CAIO_PresentationMaster Super Skill

## Folded with named destinations:
- MicrosoftPresentationExpert -> style guidance embedded in slide-design-expert + cto-caio-presentation-master patterns; Microsoft-specific deck types sourced from domain skills
- ArchitecturePresentationExpert -> cto-caio-presentation-master deck-type pattern "Architecture Review" (current->target->delta->risk->investment)
- AITransformationPresenter -> cto-caio-presentation-master deck-type pattern "AI Strategy Board Deck" (sources caio-advisor/ai-portfolio-advisor)
- PowerBIPresentationExpert, FabricPresentationExpert, PMOPresentationExpert -> cto-caio-presentation-master (sources powerbi-architect/fabric-architect/pmo-reporting for content; patterns not separate skills)

## Status: ALL FIVE KNOWLEDGE BASES RESOLVED (waves 1-5)


## Wave 6 (2026-09-24) — Saudi Digital Governance Stack (KB #6)
Built in NEW category governance/ (6 skills):
- saudi-caio-advisor (Super Agent: SDAIA+NDMO+PDPL+NCA+DGA+Vision 2030 orchestration, regulatory discipline hard-coded)
- sdaia-advisor, ndmo-advisor, pdpl-advisor, nca-advisor (the four authorities)
- dga-advisor, enterprise-risk-advisor, data-governance-advisor (DGA + international ERM + DAMA/COBIT)
Extended: ai-engineering/ai-governance + International Standards Overlay (NIST AI RMF, ISO 42001 mapping).

REGULATORY DISCIPLINE: all governance skills encode procedures + verify-current rule (source + as-of date mandatory; no invented clause numbers; verdicts -> compliance/legal/regulator). Official sources: sdaia.gov.sa, nca.gov.sa, dga.gov.sa, cst.gov.sa, vision2030.gov.sa.

## Folded with named destinations:
- AIGovernanceAdvisor -> ai-governance (extended) + sdaia-advisor (SDAIA overlay)
- DataClassificationAdvisor, DataSharingAdvisor, NationalDataIndexAdvisor -> ndmo-advisor
- PrivacyManagementAdvisor -> pdpl-advisor
- CloudGovernanceAdvisor -> azure-architect + nca-advisor (cloud controls path)
- SaudiEnterpriseArchitect -> solution-architect + saudi-caio-advisor (EA sections)
- AIEthicsAdvisor -> sdaia-advisor (ethics checklist procedure)
- Vision2030Advisor -> saudi-caio-advisor (alignment-map procedure, step 2)

## Status: ALL SIX KNOWLEDGE BASES RESOLVED

## agent-reach (upstream: Panniantong/agent-reach, MIT) — installed 2026-09-30
- Source: cloned to /tmp/agent-reach (depth 1). MEDUSA repo scan: 425 HIGH+ / 304 findings triaged
  individually (66x PLA-copyright = known LLM-heavy FP class; loopback SSRF = intended local daemon/CDP URLs;
  metadata endpoint = blocklist STRING; "SSH-key exfiltration" = configure-key help text; SHA1 = RFC6455 WS handshake).
- SkillSpector on skill dir: DO_NOT_INSTALL auto-verdict, 8 findings, ALL hand-verified false positives
  (cookie-handling prose tripping YARA/info-stealer keywords; "never judge login state from URL" flagged as anti-refusal;
  reusable Chrome profile flagged as session persistence; Jina reader fallback flagged as rug-pull; bilibili curl = the doc itself).
  Per security-gate protocol: prose mentions = FP; executable scripts or literal secrets = hard stop — none found.
- INSTALLED in adapted form (knowledge only): ~/.hermes/skills/research/agent-reach/ — SKILL.md (EN) + 7 references
  (search/social/career/dev/web/video/finance). The Python CLI/daemon is NOT installed.
- ARKAN safety overlay added: read-only default; no setup scripts, no cookies, no login automation without approval.
