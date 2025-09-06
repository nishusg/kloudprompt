// ===== Enums =====
export enum ProviderTypeEnum {
  GEMINI = 'gemini',
  CHATGPT = 'chatgpt',
  GROK = 'grok',
  OPENROUTER = 'openrouter',
  TOGETHER = 'together',
}

export enum GenerationTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  TEXT = 'text',
}

export enum VerificationStatus {
  Pending = "pending",
  Verified = "verified"
}

export enum OTPPurpose {
  Register = "register",
  Forgot = "forgot",
}

export enum PromptCategoryEnum {
  Writing = "Writing",
  Copywriting = "Copywriting",
  Storytelling = "Storytelling",
  Poetry = "Poetry",
  SocialMedia = "SocialMedia",

  Productivity = "Productivity",
  Email = "Email",
  Summaries = "Summaries",
  Notes = "Notes",
  Resume = "Resume",

  Business = "Business",
  Marketing = "Marketing",
  Branding = "Branding",
  ProductDescriptions = "ProductDescriptions",
  MarketResearch = "MarketResearch",

  Design = "Design",
  UIUX = "UIUX",
  Logo = "Logo",
  InteriorDesign = "InteriorDesign",
  FashionDesign = "FashionDesign",

  Education = "Education",
  StudyNotes = "StudyNotes",
  LessonPlans = "LessonPlans",
  LanguageLearning = "LanguageLearning",
  Coding = "Coding",
  Quiz = "Quiz",

  Technology = "Technology",
  CodeGeneration = "CodeGeneration",
  Debugging = "Debugging",
  API = "API",
  DataScience = "DataScience",
  Automation = "Automation",

  Entertainment = "Entertainment",
  Roleplay = "Roleplay",
  Trivia = "Trivia",
  Games = "Games",
  Jokes = "Jokes",
  PersonalityTests = "PersonalityTests",

  Art = "Art",
  Portraits = "Portraits",
  Landscapes = "Landscapes",
  Anime = "Anime",
  Renders3D = "Renders3D",
  AbstractArt = "AbstractArt",

  Lifestyle = "Lifestyle",
  Journaling = "Journaling",
  Fitness = "Fitness",
  Travel = "Travel",
  Recipes = "Recipes",
  Meditation = "Meditation",

  Specialized = "Specialized",
  Legal = "Legal",
  Medical = "Medical",
  Finance = "Finance",
  RealEstate = "RealEstate",
  Science = "Science"
}