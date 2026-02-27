export type ProviderInfo = {
  id: string;
  name: string;
  category: "llm" | "ocr" | "analytics" | "storage";
  bestFor: string[];
  freeTier: string;
  strengths: string[];
  limitations: string[];
  docsUrl: string;
};

export const providerCatalog: ProviderInfo[] = [
  {
    id: "google-vertex-ai",
    name: "Google Vertex AI",
    category: "llm",
    bestFor: ["Gemini multimodal", "enterprise governance", "RAG pipelines"],
    freeTier: "Free trial credits and limited usage for selected models",
    strengths: [
      "Great PDF/image understanding",
      "Strong GCP integration",
      "Managed vector/search options",
    ],
    limitations: [
      "Region/model availability varies",
      "Complex IAM setup for beginners",
    ],
    docsUrl: "https://cloud.google.com/vertex-ai/docs",
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI",
    category: "llm",
    bestFor: ["Enterprise compliance", "private networking", "Microsoft stack"],
    freeTier: "Azure credits and occasional model-specific trials",
    strengths: [
      "Security/compliance controls",
      "Regional deployments",
      "Strong B2B support",
    ],
    limitations: [
      "Provisioning approvals can delay onboarding",
      "Quota management needed at scale",
    ],
    docsUrl: "https://learn.microsoft.com/azure/ai-services/openai/",
  },
  {
    id: "aws-bedrock",
    name: "AWS Bedrock",
    category: "llm",
    bestFor: ["Multi-model strategy", "AWS-native production systems"],
    freeTier: "Limited free usage for select models in specific regions",
    strengths: [
      "Model choice across providers",
      "Guardrails + agents",
      "Deep AWS ecosystem",
    ],
    limitations: ["Per-model API differences", "Regional restrictions"],
    docsUrl: "https://docs.aws.amazon.com/bedrock/",
  },
  {
    id: "openai",
    name: "OpenAI API",
    category: "llm",
    bestFor: ["Fast prototyping", "reasoning + multimodal", "tool calling"],
    freeTier: "Credits vary by account/program",
    strengths: [
      "Strong model quality",
      "Mature SDKs",
      "Good structured outputs",
    ],
    limitations: ["Cost management required at high volume"],
    docsUrl: "https://platform.openai.com/docs",
  },
  {
    id: "google-document-ai",
    name: "Google Document AI",
    category: "ocr",
    bestFor: ["Invoices", "receipts", "forms", "large OCR workloads"],
    freeTier: "Free pages/month depending on processor",
    strengths: [
      "High OCR quality",
      "Purpose-built parsers",
      "Scales to large docs",
    ],
    limitations: ["Processor setup/config required"],
    docsUrl: "https://cloud.google.com/document-ai/docs",
  },
  {
    id: "aws-textract",
    name: "AWS Textract",
    category: "ocr",
    bestFor: ["Form/table extraction", "asynchronous large jobs"],
    freeTier: "Free tier pages for first months",
    strengths: ["Good structured extraction", "Works well with S3 pipelines"],
    limitations: ["Post-processing often needed for noisy scans"],
    docsUrl: "https://docs.aws.amazon.com/textract/",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    category: "analytics",
    bestFor: ["BI workloads", "warehouse-scale analytics"],
    freeTier: "Trial credits",
    strengths: ["Elastic compute", "Excellent SQL analytics", "Data sharing"],
    limitations: ["Can become expensive without governance"],
    docsUrl: "https://docs.snowflake.com/",
  },
];

export const supportedDocumentTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/tiff",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
