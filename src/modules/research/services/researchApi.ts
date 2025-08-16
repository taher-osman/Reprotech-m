import {
  ResearchProject,
  ExperimentInstance,
  ResearchDocument,
  PublicationSubmission,
  ResearchAnalytics,
  ResearchDashboardData,
  ResearchApiResponse,
  ResearchSearchFilters,
  ProjectStatus,
  ExperimentStatus,
  DocumentStatus,
  SubmissionStatus,
  SubmissionType,
  SubmissionEvent,
  ReviewType,
  ReviewRecommendation,
  EditorDecision,
  CommentType,
  CommentVisibility,
  PeerReviewStatus,
  ResearchRole,
  EthicalApprovalStatus,
  MilestoneStatus,
  DocumentType,
  ContributionType,
  ReferenceType,
  ActivityType,
  AlertType,
  AlertSeverity,
  ActivityPriority,
  DeadlineType,
  DeadlinePriority,
  DeadlineStatus
} from '../types/researchTypes';

// Mock Data Generators
const generateMockProjects = (): ResearchProject[] => {
  return [
    {
      id: 'proj-001',
      title: 'Advanced Bovine Embryo Development Analysis',
      description: 'Comprehensive study of early embryonic development patterns in bovine species using advanced imaging and molecular techniques.',
      objectives: [
        'Characterize embryonic development stages',
        'Identify key molecular markers',
        'Develop predictive models for viability'
      ],
      principalInvestigatorId: 'pi-001',
      principalInvestigatorName: 'Dr. Sarah Johnson',
      researchTeam: [
        {
          id: 'tm-001',
          name: 'Dr. Michael Chen',
          role: ResearchRole.CO_INVESTIGATOR,
          institution: 'University of Veterinary Sciences',
          email: 'chen@uvs.edu',
          expertise: ['Molecular Biology', 'Embryology'],
          contributionPercentage: 25,
          isActive: true,
          joinDate: new Date('2024-01-15'),
        },
        {
          id: 'tm-002',
          name: 'Dr. Lisa Anderson',
          role: ResearchRole.RESEARCH_SCIENTIST,
          institution: 'Institute of Animal Sciences',
          email: 'anderson@ias.org',
          expertise: ['Reproductive Biology', 'Data Analysis'],
          contributionPercentage: 30,
          isActive: true,
          joinDate: new Date('2024-02-01'),
        }
      ],
      fundingSource: 'National Research Foundation Grant #NRF-2024-001',
      budgetAllocated: 450000,
      budgetSpent: 234500,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      status: ProjectStatus.ACTIVE,
      species: ['Bovine'],
      ethicalApprovalStatus: EthicalApprovalStatus.APPROVED,
      ethicalApprovalNumber: 'IACUC-2023-045',
      ethicalApprovalDate: new Date('2023-11-15'),
      regulatoryCompliance: ['IACUC', 'USDA', 'ISO 9001'],
      milestones: [
        {
          id: 'ms-001',
          title: 'Protocol Development Complete',
          description: 'Finalize all experimental protocols and procedures',
          targetDate: new Date('2024-03-01'),
          completionDate: new Date('2024-02-28'),
          status: MilestoneStatus.COMPLETED,
          deliverables: ['Protocol Document', 'SOP Manual'],
          responsiblePersonId: 'pi-001',
          dependencies: []
        },
        {
          id: 'ms-002',
          title: 'Phase 1 Data Collection',
          description: 'Complete initial data collection phase',
          targetDate: new Date('2024-08-31'),
          status: MilestoneStatus.IN_PROGRESS,
          deliverables: ['Raw Data Files', 'Quality Reports'],
          responsiblePersonId: 'tm-002',
          dependencies: ['ms-001']
        }
      ],
      associatedPublications: ['pub-001', 'pub-002'],
      intellectualProperty: ['Patent Application #12345'],
      createdAt: new Date('2023-12-01'),
      updatedAt: new Date('2024-06-15')
    },
    {
      id: 'proj-002',
      title: 'Genomic Markers for Fertility Prediction in Dairy Cattle',
      description: 'Identification and validation of genomic markers associated with fertility traits in Holstein dairy cattle.',
      objectives: [
        'Identify fertility-associated SNPs',
        'Develop genomic prediction models',
        'Validate markers in commercial populations'
      ],
      principalInvestigatorId: 'pi-002',
      principalInvestigatorName: 'Dr. Robert Williams',
      researchTeam: [
        {
          id: 'tm-003',
          name: 'Dr. Emily Davis',
          role: ResearchRole.POSTDOC,
          institution: 'Agricultural Research Institute',
          email: 'davis@ari.edu',
          expertise: ['Genomics', 'Bioinformatics'],
          contributionPercentage: 40,
          isActive: true,
          joinDate: new Date('2024-03-01'),
        }
      ],
      fundingSource: 'Dairy Industry Consortium',
      budgetAllocated: 650000,
      budgetSpent: 189750,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2027-02-28'),
      status: ProjectStatus.ACTIVE,
      species: ['Bovine'],
      ethicalApprovalStatus: EthicalApprovalStatus.APPROVED,
      ethicalApprovalNumber: 'IACUC-2024-012',
      ethicalApprovalDate: new Date('2024-01-20'),
      regulatoryCompliance: ['IACUC', 'FDA'],
      milestones: [
        {
          id: 'ms-003',
          title: 'Sample Collection Complete',
          description: 'Collect samples from 1000 dairy cows',
          targetDate: new Date('2024-12-31'),
          status: MilestoneStatus.IN_PROGRESS,
          deliverables: ['DNA Samples', 'Phenotype Data'],
          responsiblePersonId: 'tm-003',
          dependencies: []
        }
      ],
      associatedPublications: [],
      intellectualProperty: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-20')
    }
  ];
};

const generateMockExperiments = (): ExperimentInstance[] => {
  return [
    {
      id: 'exp-001',
      protocolId: 'prot-001',
      projectId: 'proj-001',
      title: 'Embryo Viability Assessment - Batch 1',
      description: 'Assessment of embryo viability using morphological and molecular criteria',
      assignedPersonnel: [
        {
          personId: 'tm-001',
          name: 'Dr. Michael Chen',
          role: 'Lead Researcher',
          responsibility: 'Protocol execution and data collection',
          startDate: new Date('2024-05-01'),
          hoursAllocated: 120,
          hoursWorked: 95,
          performance: 9
        }
      ],
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-06-30'),
      actualDuration: 45,
      status: ExperimentStatus.COMPLETED,
      environmentalConditions: [
        {
          id: 'env-001',
          timestamp: new Date('2024-05-01T08:00:00Z'),
          temperature: 37.5,
          humidity: 65,
          pressure: 1013.25,
          lightLevel: 0,
          co2Level: 5.5,
          phLevel: 7.4,
          notes: 'Optimal conditions maintained',
          recordedBy: 'tm-001'
        }
      ],
      researchSubjects: [],
      dataCollectionSessions: [],
      deviations: [],
      costTracking: {
        budgetAllocated: 25000,
        actualCost: 23750,
        materialCosts: 15000,
        equipmentCosts: 5000,
        personnelCosts: 3750,
        overheadCosts: 0,
        costBreakdown: [],
        costVariance: -1250,
        lastUpdated: new Date('2024-06-30')
      },
      notes: 'Experiment completed successfully with high data quality',
      completionRate: 100,
      dataIntegrityScore: 95,
      qualityScore: 92,
      createdAt: new Date('2024-04-15'),
      updatedAt: new Date('2024-06-30')
    }
  ];
};

const generateMockDocuments = (): ResearchDocument[] => {
  return [
    {
      id: 'doc-001',
      title: 'Morphological Assessment of Bovine Embryo Development: A Comprehensive Analysis',
      abstract: 'This study presents a detailed morphological assessment of bovine embryo development from fertilization through blastocyst stage. We analyzed 245 embryos using advanced imaging techniques and established quality grading criteria based on developmental milestones.',
      keywords: ['bovine embryo', 'morphology', 'development', 'quality assessment', 'blastocyst'],
      documentType: DocumentType.MANUSCRIPT,
      projectId: 'proj-001',
      authors: [
        {
          id: 'auth-001',
          name: 'Dr. Sarah Johnson',
          affiliation: 'University of Veterinary Sciences',
          email: 'johnson@uvs.edu',
          orcid: '0000-0001-2345-6789',
          isCorresponding: true,
          contributionTypes: [ContributionType.CONCEPTUALIZATION, ContributionType.WRITING_ORIGINAL_DRAFT],
          contributionPercentage: 40,
          conflictOfInterest: 'None declared',
          order: 1
        },
        {
          id: 'auth-002',
          name: 'Dr. Michael Chen',
          affiliation: 'University of Veterinary Sciences',
          email: 'chen@uvs.edu',
          orcid: '0000-0002-3456-7890',
          isCorresponding: false,
          contributionTypes: [ContributionType.INVESTIGATION, ContributionType.DATA_CURATION],
          contributionPercentage: 35,
          conflictOfInterest: 'None declared',
          order: 2
        }
      ],
      status: DocumentStatus.UNDER_PEER_REVIEW,
      content: 'Full manuscript content would be stored here...',
      references: [
        {
          id: 'ref-001',
          type: ReferenceType.JOURNAL_ARTICLE,
          title: 'Embryonic development in cattle: Recent advances',
          authors: ['Smith, J.', 'Brown, K.'],
          journal: 'Journal of Reproductive Biology',
          year: 2023,
          volume: '45',
          issue: '3',
          pages: '123-135',
          doi: '10.1234/jrb.2023.45.123',
          citationStyle: 'APA',
          notes: 'Key reference for methodology'
        }
      ],
      figures: [
        {
          id: 'fig-001',
          number: 1,
          title: 'Embryo Development Stages',
          caption: 'Representative images of bovine embryo development from Day 1 to Day 7',
          filePath: '/figures/embryo_stages.png',
          fileType: 'PNG',
          resolution: '300 DPI',
          size: 2048576,
          generatedFrom: 'Microscopy imaging',
          permissions: 'Original work',
          notes: 'High-resolution composite image'
        }
      ],
      tables: [
        {
          id: 'tab-001',
          number: 1,
          title: 'Embryo Quality Assessment Criteria',
          caption: 'Detailed criteria used for embryo quality grading',
          headers: ['Grade', 'Morphology', 'Cell Count', 'Fragmentation'],
          rows: [
            ['A', 'Excellent', '8-16', '<10%'],
            ['B', 'Good', '6-8', '10-25%'],
            ['C', 'Fair', '4-6', '25-50%']
          ],
          footnotes: ['Grading based on IETS standards'],
          generatedFrom: 'Analysis results',
          formatting: {
            style: 'scientific',
            cellPadding: 5,
            borderStyle: 'simple',
            headerStyle: 'bold',
            alternateRowColors: true,
            fontSize: 10
          },
          notes: 'Standard grading system'
        }
      ],
      supplementaryMaterials: [],
      journalTargets: [
        {
          id: 'jt-001',
          journalName: 'Theriogenology',
          issn: '0093-691X',
          impactFactor: 2.923,
          quartile: 'Q1',
          category: 'Veterinary Sciences',
          submissionGuidelines: 'https://www.journals.elsevier.com/theriogenology',
          fees: 3200,
          openAccess: false,
          reviewType: ReviewType.DOUBLE_BLIND,
          averageReviewTime: 45,
          acceptanceRate: 35,
          priority: 1,
          notes: 'Primary target journal'
        }
      ],
      wordCount: 4567,
      pageCount: 12,
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-06-15'),
      lastEditedBy: 'auth-001',
      version: 3,
      versionHistory: [
        {
          version: 1,
          timestamp: new Date('2024-04-01'),
          authorId: 'auth-001',
          changes: 'Initial draft',
          content: 'First version content...',
          notes: 'Initial submission',
          approved: false
        },
        {
          version: 2,
          timestamp: new Date('2024-05-15'),
          authorId: 'auth-001',
          changes: 'Added statistical analysis section',
          content: 'Second version content...',
          notes: 'Added statistical analysis',
          approved: true,
          approvedBy: 'auth-002'
        }
      ]
    }
  ];
};

const generateMockSubmissions = (): PublicationSubmission[] => {
  return [
    {
      id: 'sub-001',
      documentId: 'doc-001',
      journalId: 'jt-001',
      submissionDate: new Date('2024-06-20'),
      manuscriptId: 'THERI-2024-001234',
      status: SubmissionStatus.UNDER_REVIEW,
      submissionType: SubmissionType.ORIGINAL_RESEARCH,
      coverLetter: 'Dear Editor, We are pleased to submit our manuscript...',
      reviewerSuggestions: ['Dr. Jane Smith - Expert in embryology', 'Dr. Robert Brown - Reproductive biology specialist'],
      excludedReviewers: ['Dr. John Competitor'],
      timeline: [
        {
          id: 'tl-001',
          timestamp: new Date('2024-06-20'),
          event: SubmissionEvent.SUBMITTED,
          description: 'Manuscript submitted to journal',
          automated: false,
          notes: 'Initial submission'
        },
        {
          id: 'tl-002',
          timestamp: new Date('2024-06-22'),
          event: SubmissionEvent.EDITOR_ASSIGNED,
          description: 'Associate editor assigned',
          automated: true,
          notes: 'Dr. Patricia Wilson assigned'
        }
      ],
      peerReviewProcess: {
        reviewers: [
          {
            id: 'rev-001',
            anonymousId: 'Reviewer #1',
            invitationDate: new Date('2024-06-25'),
            responseDate: new Date('2024-06-27'),
            accepted: true,
            recommendation: ReviewRecommendation.MINOR_REVISION,
            comments: 'The manuscript presents interesting findings...',
            rating: 7,
            expertise: 9,
            timeliness: 8
          }
        ],
        reviewRounds: [
          {
            round: 1,
            startDate: new Date('2024-06-25'),
            reviewersAssigned: 3,
            reviewsReceived: 2,
            averageRating: 7.5,
            majorConcerns: ['Statistical analysis needs clarification'],
            minorConcerns: ['Minor formatting issues'],
            editorDecision: EditorDecision.MINOR_REVISION
          }
        ],
        editorComments: [
          {
            id: 'ed-001',
            timestamp: new Date('2024-07-01'),
            editorId: 'ed-001',
            comment: 'Please address reviewer concerns regarding statistical methods',
            type: CommentType.METHODOLOGY,
            visibility: CommentVisibility.AUTHOR
          }
        ],
        currentRound: 1,
        reviewDeadline: new Date('2024-07-15'),
        status: PeerReviewStatus.REVIEWS_COMPLETED
      },
      revisionHistory: [],
      articleMetrics: {
        views: 0,
        downloads: 0,
        citations: 0,
        altmetricScore: 0,
        socialMediaMentions: 0,
        newsOutletMentions: 0,
        researchHighlights: 0,
        impactScore: 0,
        lastUpdated: new Date('2024-06-20')
      },
      notes: 'Submission proceeding normally'
    }
  ];
};

const generateMockDashboardData = (): ResearchDashboardData => {
  return {
    summary: {
      totalProjects: 8,
      activeProjects: 5,
      totalExperiments: 23,
      activeExperiments: 7,
      totalPublications: 15,
      publishedPapers: 12,
      totalBudget: 2450000,
      budgetUtilized: 1567800,
      teamMembers: 12,
      completionRate: 78.5
    },
    recentActivity: [
      {
        id: 'act-001',
        type: ActivityType.PAPER_ACCEPTED,
        title: 'Manuscript Accepted',
        description: 'Bovine embryo development paper accepted in Theriogenology',
        timestamp: new Date('2024-06-25T14:30:00Z'),
        actorId: 'pi-001',
        actorName: 'Dr. Sarah Johnson',
        relatedEntityId: 'doc-001',
        relatedEntityType: 'document',
        priority: ActivityPriority.HIGH
      },
      {
        id: 'act-002',
        type: ActivityType.EXPERIMENT_COMPLETED,
        title: 'Experiment Completed',
        description: 'Embryo viability assessment batch 1 completed successfully',
        timestamp: new Date('2024-06-20T16:45:00Z'),
        actorId: 'tm-001',
        actorName: 'Dr. Michael Chen',
        relatedEntityId: 'exp-001',
        relatedEntityType: 'experiment',
        priority: ActivityPriority.MEDIUM
      }
    ],
    upcomingDeadlines: [
      {
        id: 'dl-001',
        title: 'Manuscript Revision Due',
        description: 'Submit revised version of embryo development paper',
        deadline: new Date('2024-07-15'),
        type: DeadlineType.DOCUMENT_SUBMISSION,
        priority: DeadlinePriority.HIGH,
        relatedEntityId: 'doc-001',
        relatedEntityType: 'document',
        assignedTo: 'Dr. Sarah Johnson',
        status: DeadlineStatus.UPCOMING
      },
      {
        id: 'dl-002',
        title: 'Project Milestone',
        description: 'Complete Phase 1 data collection',
        deadline: new Date('2024-08-31'),
        type: DeadlineType.PROJECT_MILESTONE,
        priority: DeadlinePriority.MEDIUM,
        relatedEntityId: 'proj-001',
        relatedEntityType: 'project',
        assignedTo: 'Dr. Lisa Anderson',
        status: DeadlineStatus.UPCOMING
      }
    ],
    performanceMetrics: {
      overallEfficiency: 87.3,
      qualityScore: 91.2,
      innovationIndex: 82.7,
      impactScore: 89.1,
      collaborationScore: 85.6,
      sustainabilityScore: 78.9,
      benchmarkComparisons: [
        {
          metric: 'Publication Rate',
          ourValue: 2.1,
          industryAverage: 1.8,
          bestInClass: 2.8,
          percentile: 75
        },
        {
          metric: 'Grant Success Rate',
          ourValue: 68,
          industryAverage: 45,
          bestInClass: 85,
          percentile: 85
        }
      ]
    },
    alerts: [
      {
        id: 'alert-001',
        type: AlertType.DEADLINE_APPROACHING,
        severity: AlertSeverity.WARNING,
        title: 'Revision Deadline Approaching',
        message: 'Manuscript revision due in 10 days',
        timestamp: new Date('2024-07-05T09:00:00Z'),
        relatedEntityId: 'doc-001',
        relatedEntityType: 'document',
        actionRequired: true,
        dismissed: false
      },
      {
        id: 'alert-002',
        type: AlertType.BUDGET_THRESHOLD,
        severity: AlertSeverity.INFO,
        title: 'Budget Utilization Update',
        message: 'Project budget 75% utilized - on track for completion',
        timestamp: new Date('2024-07-01T12:00:00Z'),
        relatedEntityId: 'proj-001',
        relatedEntityType: 'project',
        actionRequired: false,
        dismissed: false
      }
    ]
  };
};

// API Functions
export class ResearchApiService {
  private static instance: ResearchApiService;
  private projects: ResearchProject[] = generateMockProjects();
  private experiments: ExperimentInstance[] = generateMockExperiments();
  private documents: ResearchDocument[] = generateMockDocuments();
  private submissions: PublicationSubmission[] = generateMockSubmissions();

  public static getInstance(): ResearchApiService {
    if (!ResearchApiService.instance) {
      ResearchApiService.instance = new ResearchApiService();
    }
    return ResearchApiService.instance;
  }

  // Dashboard API
  async getDashboardData(): Promise<ResearchApiResponse<ResearchDashboardData>> {
    await this.simulateDelay();
    return {
      data: generateMockDashboardData(),
      success: true,
      message: 'Dashboard data retrieved successfully'
    };
  }

  // Project Management APIs
  async getProjects(filters?: ResearchSearchFilters): Promise<ResearchApiResponse<ResearchProject[]>> {
    await this.simulateDelay();
    let filteredProjects = [...this.projects];

    if (filters) {
      if (filters.status?.length) {
        filteredProjects = filteredProjects.filter(p => filters.status?.includes(p.status));
      }
      if (filters.species?.length) {
        filteredProjects = filteredProjects.filter(p => 
          p.species.some(species => filters.species?.includes(species))
        );
      }
      if (filters.dateRange) {
        filteredProjects = filteredProjects.filter(p => 
          p.startDate >= filters.dateRange!.start && p.startDate <= filters.dateRange!.end
        );
      }
    }

    return {
      data: filteredProjects,
      success: true,
      message: 'Projects retrieved successfully',
      metadata: {
        total: filteredProjects.length,
        page: 1,
        limit: 50,
        hasNext: false,
        hasPrevious: false
      }
    };
  }

  async getProjectById(id: string): Promise<ResearchApiResponse<ResearchProject | null>> {
    await this.simulateDelay();
    const project = this.projects.find(p => p.id === id);
    return {
      data: project || null,
      success: !!project,
      message: project ? 'Project retrieved successfully' : 'Project not found'
    };
  }

  async createProject(project: Omit<ResearchProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchApiResponse<ResearchProject>> {
    await this.simulateDelay();
    const newProject: ResearchProject = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.push(newProject);
    return {
      data: newProject,
      success: true,
      message: 'Project created successfully'
    };
  }

  async updateProject(id: string, updates: Partial<ResearchProject>): Promise<ResearchApiResponse<ResearchProject | null>> {
    await this.simulateDelay();
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      return {
        data: null,
        success: false,
        message: 'Project not found'
      };
    }

    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date()
    };

    return {
      data: this.projects[index],
      success: true,
      message: 'Project updated successfully'
    };
  }

  async deleteProject(id: string): Promise<ResearchApiResponse<boolean>> {
    await this.simulateDelay();
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      return {
        data: false,
        success: false,
        message: 'Project not found'
      };
    }

    this.projects.splice(index, 1);
    return {
      data: true,
      success: true,
      message: 'Project deleted successfully'
    };
  }

  // Experiment Management APIs
  async getExperiments(projectId?: string): Promise<ResearchApiResponse<ExperimentInstance[]>> {
    await this.simulateDelay();
    let filteredExperiments = [...this.experiments];
    
    if (projectId) {
      filteredExperiments = filteredExperiments.filter(e => e.projectId === projectId);
    }

    return {
      data: filteredExperiments,
      success: true,
      message: 'Experiments retrieved successfully'
    };
  }

  async getExperimentById(id: string): Promise<ResearchApiResponse<ExperimentInstance | null>> {
    await this.simulateDelay();
    const experiment = this.experiments.find(e => e.id === id);
    return {
      data: experiment || null,
      success: !!experiment,
      message: experiment ? 'Experiment retrieved successfully' : 'Experiment not found'
    };
  }

  async createExperiment(experiment: Omit<ExperimentInstance, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchApiResponse<ExperimentInstance>> {
    await this.simulateDelay();
    const newExperiment: ExperimentInstance = {
      ...experiment,
      id: `exp-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.experiments.push(newExperiment);
    return {
      data: newExperiment,
      success: true,
      message: 'Experiment created successfully'
    };
  }

  // Document Management APIs
  async getDocuments(projectId?: string): Promise<ResearchApiResponse<ResearchDocument[]>> {
    await this.simulateDelay();
    let filteredDocuments = [...this.documents];
    
    if (projectId) {
      filteredDocuments = filteredDocuments.filter(d => d.projectId === projectId);
    }

    return {
      data: filteredDocuments,
      success: true,
      message: 'Documents retrieved successfully'
    };
  }

  async getDocumentById(id: string): Promise<ResearchApiResponse<ResearchDocument | null>> {
    await this.simulateDelay();
    const document = this.documents.find(d => d.id === id);
    return {
      data: document || null,
      success: !!document,
      message: document ? 'Document retrieved successfully' : 'Document not found'
    };
  }

  async createDocument(document: Omit<ResearchDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchApiResponse<ResearchDocument>> {
    await this.simulateDelay();
    const newDocument: ResearchDocument = {
      ...document,
      id: `doc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.push(newDocument);
    return {
      data: newDocument,
      success: true,
      message: 'Document created successfully'
    };
  }

  // Publication Management APIs
  async getSubmissions(): Promise<ResearchApiResponse<PublicationSubmission[]>> {
    await this.simulateDelay();
    return {
      data: this.submissions,
      success: true,
      message: 'Submissions retrieved successfully'
    };
  }

  async getSubmissionById(id: string): Promise<ResearchApiResponse<PublicationSubmission | null>> {
    await this.simulateDelay();
    const submission = this.submissions.find(s => s.id === id);
    return {
      data: submission || null,
      success: !!submission,
      message: submission ? 'Submission retrieved successfully' : 'Submission not found'
    };
  }

  async createSubmission(submission: Omit<PublicationSubmission, 'id'>): Promise<ResearchApiResponse<PublicationSubmission>> {
    await this.simulateDelay();
    const newSubmission: PublicationSubmission = {
      ...submission,
      id: `sub-${Date.now()}`
    };
    this.submissions.push(newSubmission);
    return {
      data: newSubmission,
      success: true,
      message: 'Submission created successfully'
    };
  }

  // Analytics APIs
  async getAnalytics(): Promise<ResearchApiResponse<ResearchAnalytics>> {
    await this.simulateDelay();
    
    // Generate comprehensive analytics based on current data
    const analytics: ResearchAnalytics = {
      projectAnalytics: {
        totalProjects: this.projects.length,
        activeProjects: this.projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
        completedProjects: this.projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
        projectsByStatus: this.projects.reduce((acc, project) => {
          acc[project.status] = (acc[project.status] || 0) + 1;
          return acc;
        }, {} as Record<ProjectStatus, number>),
        projectsBySpecies: this.projects.reduce((acc, project) => {
          project.species.forEach(species => {
            acc[species] = (acc[species] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>),
        averageProjectDuration: 24, // months
        budgetUtilization: 64.2,
        milestoneCompletionRate: 78.5,
        successRate: 85.3,
        trendsOverTime: []
      },
      experimentAnalytics: {
        totalExperiments: this.experiments.length,
        activeExperiments: this.experiments.filter(e => e.status === ExperimentStatus.ACTIVE).length,
        completedExperiments: this.experiments.filter(e => e.status === ExperimentStatus.COMPLETED).length,
        experimentsByStatus: this.experiments.reduce((acc, experiment) => {
          acc[experiment.status] = (acc[experiment.status] || 0) + 1;
          return acc;
        }, {} as Record<ExperimentStatus, number>),
        averageExperimentDuration: 45,
        dataQualityScore: 92.3,
        protocolComplianceRate: 94.7,
        costPerExperiment: 25000,
        efficiencyMetrics: {
          averageSetupTime: 8.5,
          averageDataCollectionTime: 32.0,
          resourceUtilizationRate: 87.2,
          personnelEfficiency: 91.5,
          equipmentUptime: 94.8,
          costEfficiency: 89.3
        },
        qualityMetrics: {
          dataIntegrityScore: 95.2,
          protocolAdherenceScore: 93.8,
          qualityControlPassRate: 97.1,
          deviationRate: 2.3,
          errorRate: 1.2,
          reproducibilityScore: 91.7
        }
      },
      publicationAnalytics: {
        totalPublications: this.documents.length,
        publicationsByStatus: this.documents.reduce((acc, document) => {
          acc[document.status] = (acc[document.status] || 0) + 1;
          return acc;
        }, {} as Record<DocumentStatus, number>),
        publicationsByType: this.documents.reduce((acc, document) => {
          acc[document.documentType] = (acc[document.documentType] || 0) + 1;
          return acc;
        }, {} as Record<DocumentType, number>),
        acceptanceRate: 73.2,
        averageReviewTime: 52,
        impactFactorDistribution: {
          q1Journals: 3,
          q2Journals: 2,
          q3Journals: 1,
          q4Journals: 0,
          averageImpactFactor: 3.15,
          totalImpactPoints: 18.9
        },
        citationAnalytics: {
          totalCitations: 147,
          hIndex: 8,
          i10Index: 6,
          averageCitationsPerPaper: 12.25,
          citationTrends: [],
          topCitedPapers: []
        },
        collaborationNetwork: {
          totalCollaborators: 15,
          institutionalCollaborations: [],
          internationalCollaborations: [],
          collaborationStrength: []
        }
      },
      teamAnalytics: {
        totalMembers: 12,
        membersByRole: {
          [ResearchRole.PRINCIPAL_INVESTIGATOR]: 2,
          [ResearchRole.CO_INVESTIGATOR]: 3,
          [ResearchRole.RESEARCH_SCIENTIST]: 2,
          [ResearchRole.POSTDOC]: 2,
          [ResearchRole.PHD_STUDENT]: 1,
          [ResearchRole.RESEARCH_TECHNICIAN]: 1,
          [ResearchRole.DATA_ANALYST]: 1,
          [ResearchRole.STATISTICIAN]: 0,
          [ResearchRole.LABORATORY_MANAGER]: 0,
          [ResearchRole.RESEARCH_COORDINATOR]: 0
        },
        averageExperience: 8.5,
        productivityMetrics: {
          averagePublicationsPerMember: 1.25,
          averageExperimentsPerMember: 1.92,
          averageDataPointsPerMember: 234,
          qualityScore: 88.7,
          efficiencyScore: 86.3,
          innovationScore: 82.1
        },
        collaborationMetrics: {
          crossFunctionalProjects: 5,
          mentorshipRelationships: 7,
          knowledgeTransferScore: 84.2,
          teamCohesionScore: 89.5,
          communicationScore: 87.8
        },
        performanceDistribution: {
          highPerformers: 4,
          averagePerformers: 6,
          developingPerformers: 2,
          performanceGrowthRate: 12.3,
          retentionRate: 91.7
        }
      },
      financialAnalytics: {
        totalBudget: 2450000,
        totalSpent: 1567800,
        budgetUtilization: 64.0,
        costPerProject: 306250,
        costPerExperiment: 68208,
        costPerPublication: 104520,
        roi: 3.2,
        fundingSourceDistribution: {
          government: 60,
          private: 25,
          institutional: 10,
          international: 3,
          collaborative: 2
        },
        costTrends: []
      },
      performanceMetrics: {
        overallEfficiency: 87.3,
        qualityScore: 91.2,
        innovationIndex: 82.7,
        impactScore: 89.1,
        collaborationScore: 85.6,
        sustainabilityScore: 78.9,
        benchmarkComparisons: [
          {
            metric: 'Publication Rate',
            ourValue: 2.1,
            industryAverage: 1.8,
            bestInClass: 2.8,
            percentile: 75
          },
          {
            metric: 'Grant Success Rate',
            ourValue: 68,
            industryAverage: 45,
            bestInClass: 85,
            percentile: 85
          }
        ]
      },
      generatedAt: new Date()
    };

    return {
      data: analytics,
      success: true,
      message: 'Analytics retrieved successfully'
    };
  }

  // Search APIs
  async searchAll(query: string, filters?: ResearchSearchFilters): Promise<ResearchApiResponse<{
    projects: ResearchProject[];
    experiments: ExperimentInstance[];
    documents: ResearchDocument[];
  }>> {
    await this.simulateDelay();
    
    const searchTerm = query.toLowerCase();
    
    const projects = this.projects.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.objectives.some(obj => obj.toLowerCase().includes(searchTerm))
    );

    const experiments = this.experiments.filter(e =>
      e.title.toLowerCase().includes(searchTerm) ||
      e.description.toLowerCase().includes(searchTerm) ||
      e.notes.toLowerCase().includes(searchTerm)
    );

    const documents = this.documents.filter(d =>
      d.title.toLowerCase().includes(searchTerm) ||
      d.abstract.toLowerCase().includes(searchTerm) ||
      d.keywords.some(kw => kw.toLowerCase().includes(searchTerm))
    );

    return {
      data: { projects, experiments, documents },
      success: true,
      message: 'Search completed successfully'
    };
  }

  // Utility Methods
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const researchApi = ResearchApiService.getInstance(); 