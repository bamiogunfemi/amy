import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  useCreateCandidate,
  SkillsSelector,
  SelectedSkill,
} from "@amy/ui";
import { toast } from "sonner";
import { Layout } from "@/components/layout";
import { ArrowLeft, Save, X } from "lucide-react";

export function NewCandidatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);

  // Use the actual API hook
  const createCandidate = useCreateCandidate();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match API schema
      const candidateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        location: data.location || undefined,
        experienceLevel: data.experienceLevel || undefined,
        headline: data.headline || undefined,
        summary: data.summary || undefined,
        source: data.source || "MANUAL",
        // Include skills if any are selected
        ...(selectedSkills.length > 0 && { skills: selectedSkills }),
      };

      // Create candidate with skills
      const candidate = await createCandidate.mutateAsync(candidateData);

      console.log("Candidate created successfully:", candidate);
      toast.success("Candidate created successfully!");

      navigate({ to: "/candidates" });
    } catch (error) {
      console.error("Failed to create candidate:", error);
      toast.error("Failed to create candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/candidates" });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                New Candidate
              </h1>
              <p className="text-slate-600 mt-1">
                Add a new candidate to your pool
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  firstName: formData.get("firstName") as string,
                  lastName: formData.get("lastName") as string,
                  email: formData.get("email") as string,
                  phone: formData.get("phone") as string,
                  location: formData.get("location") as string,
                  experienceLevel: formData.get("experienceLevel") as string,
                  headline: formData.get("headline") as string,
                  summary: formData.get("summary") as string,
                  source: formData.get("source") as string,
                };
                onSubmit(data);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    placeholder="Enter candidate's first name"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    placeholder="Enter candidate's last name"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter candidate's email"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    placeholder="Enter candidate's phone number"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <Input
                    name="location"
                    placeholder="Enter candidate's location"
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="experienceLevel"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Select experience level</option>
                    <option value="ENTRY">Entry Level (0-2 years)</option>
                    <option value="JUNIOR">Junior (2-5 years)</option>
                    <option value="MID">Mid Level (5-8 years)</option>
                    <option value="SENIOR">Senior (8-12 years)</option>
                    <option value="LEAD">Lead (12+ years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Professional Headline
                </label>
                <Input
                  name="headline"
                  placeholder="e.g., Senior Frontend Developer, Product Manager"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Summary
                </label>
                <textarea
                  name="summary"
                  rows={4}
                  placeholder="Add a brief summary of the candidate's background, skills, and experience..."
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="source"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Source
                </label>
                <select
                  id="source"
                  name="source"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="MANUAL">Manual Entry</option>
                  <option value="UPLOAD">File Upload</option>
                  <option value="DRIVE">Google Drive</option>
                  <option value="CSV">CSV Import</option>
                  <option value="EXCEL">Excel Import</option>
                  <option value="AIRTABLE">Airtable Import</option>
                  <option value="GOOGLE_SHEETS">Google Sheets Import</option>
                  <option value="ADMIN_ASSIGN">Admin Assignment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Skills
                </label>
                <SkillsSelector
                  selectedSkills={selectedSkills}
                  onSkillsChange={setSelectedSkills}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Creating..." : "Create Candidate"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
