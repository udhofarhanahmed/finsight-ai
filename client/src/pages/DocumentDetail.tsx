import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Markdown } from "@/components/Markdown";
import { ArrowLeft, Loader2, BarChart3, FileText } from "lucide-react";
import { useRoute, useLocation } from "wouter";

export default function DocumentDetail() {
  const [, params] = useRoute("/document/:id");
  const [, navigate] = useLocation();
  const documentId = params?.id ? parseInt(params.id) : null;

  const { data: detail, isLoading } = trpc.documents.getDetail.useQuery(
    { documentId: documentId! },
    { enabled: !!documentId }
  );

  if (!documentId) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Document not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!detail) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Document not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { document, analysis, metrics } = detail;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{document.fileName}</h1>
            <p className="text-muted-foreground">
              Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold capitalize">{document.status}</p>
              </div>
              <div>
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                    document.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : document.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : document.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {document.status}
                </span>
              </div>
            </div>
            {document.errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{document.errorMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Executive Summary</TabsTrigger>
              <TabsTrigger value="metrics">Financial Metrics</TabsTrigger>
              <TabsTrigger value="text">Extracted Text</TabsTrigger>
            </TabsList>

            {/* Executive Summary Tab */}
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Executive Summary</CardTitle>
                  <CardDescription>AI-generated analysis of the document</CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.executiveSummary ? (
                    <Markdown mode="static">{analysis.executiveSummary}</Markdown>
                  ) : (
                    <p className="text-muted-foreground">No summary available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Financial Metrics
                  </CardTitle>
                  <CardDescription>Extracted key financial indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  {metrics && metrics.length > 0 ? (
                    <div className="space-y-3">
                      {metrics.map((metric) => (
                        <div
                          key={metric.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{metric.metricName}</p>
                            {metric.metricYear && (
                              <p className="text-sm text-muted-foreground">{metric.metricYear}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {metric.metricValue} {metric.metricUnit || ""}
                            </p>
                            {metric.confidence && (
                              <p className="text-xs text-muted-foreground">
                                Confidence: {metric.confidence}%
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No metrics extracted</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Extracted Text Tab */}
            <TabsContent value="text">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Extracted Text
                  </CardTitle>
                  <CardDescription>Raw text extracted from the PDF</CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.extractedText ? (
                    <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                      <p className="text-sm whitespace-pre-wrap font-mono">{analysis.extractedText}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No text extracted</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!analysis && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No analysis available yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
