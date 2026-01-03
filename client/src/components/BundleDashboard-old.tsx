import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Lock, ArrowRight, Award, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface BundleDashboardProps {
  enrollmentId: number;
  learnerName: string;
}

export default function BundleDashboard({ enrollmentId, learnerName }: BundleDashboardProps) {
  // Fetch real bundle progress from backend
  const { data: bundleData, isLoading } = trpc.student.getBundleProgress.useQuery({
    enrollmentId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your bundle progress...</p>
        </div>
      </div>
    );
  }

  if (!bundleData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load bundle progress</p>
      </div>
    );
  }

  const [currentLevel, setCurrentLevel] = useState<"beginner" | "intermediary" | "proficient">(bundleData.currentLevel);
  
  // Transform backend data to component format
  const levels = bundleData.levels.map((levelData) => {
    const levelNames = {
      beginner: "Beginner",
      intermediary: "Intermediary",
      proficient: "Proficient",
    };

    const levelDescriptions = {
      beginner: "Learn the Edo alphabet, basic greetings, numbers, and everyday vocabulary",
      intermediary: "Form sentences, ask questions, and explore Edo culture",
      proficient: "Master advanced grammar and confident communication",
    };

    let status: "active" | "completed" | "locked";
    if (!levelData.isUnlocked) {
      status = "locked";
    } else if (levelData.completionPercentage === 100) {
      status = "completed";
    } else {
      status = "active";
    }

    return {
      id: levelData.level,
      name: levelNames[levelData.level],
      description: levelDescriptions[levelData.level],
      modules: 4,
      weeks: 8,
      classTime: "11:00 AM GMT",
      status,
      progress: levelData.completionPercentage,
      completedModules: levelData.completedModules.length,
    };
  });

  const totalModules = levels.reduce((sum, level) => sum + level.modules, 0);
  const completedModules = levels.reduce((sum, level) => sum + level.completedModules, 0);
  const overallProgress = (completedModules / totalModules) * 100;

  const activeLevel = levels.find(l => l.id === currentLevel);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          Welcome back, {learnerName.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Complete Bundle - Your journey from beginner to fluency
        </p>
      </div>

      {/* Overall Progress Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Bundle Progress
              </CardTitle>
              <CardDescription>
                {completedModules} of {totalModules} modules completed across all levels
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{Math.round(overallProgress)}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex items-center justify-between mt-4 text-sm">
            <span className="text-muted-foreground">Beginner → Intermediary → Proficient</span>
            <span className="font-medium">{totalModules - completedModules} modules remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Learning Path</h2>
        <div className="grid gap-4">
          {levels.map((level, index) => {
            const isActive = level.status === "active";
            const isCompleted = level.status === "completed";
            const isLocked = level.status === "locked";

            return (
              <Card 
                key={level.id}
                className={`${
                  isActive ? "border-primary bg-primary/5" : 
                  isCompleted ? "border-green-500/50 bg-green-50/50" :
                  "border-muted bg-muted/20"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        isActive ? "bg-primary/10" :
                        isCompleted ? "bg-green-100" :
                        "bg-muted"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : isLocked ? (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-xl">Level {index + 1}: {level.name}</CardTitle>
                          {isActive && <Badge>Current Level</Badge>}
                          {isCompleted && <Badge variant="outline" className="border-green-500 text-green-700">Completed</Badge>}
                          {isLocked && <Badge variant="secondary">Locked</Badge>}
                        </div>
                        <CardDescription className="mb-3">{level.description}</CardDescription>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{level.modules} modules</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{level.weeks} weeks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{level.classTime} • Saturdays</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!isLocked && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{level.progress}%</p>
                        <p className="text-xs text-muted-foreground">{level.completedModules}/{level.modules} modules</p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                {!isLocked && (
                  <CardContent>
                    <Progress value={level.progress} className="mb-4" />
                    <Button 
                      className="w-full"
                      disabled={isCompleted}
                      onClick={() => {
                        // TODO: Navigate to the specific level's course content
                        window.location.href = `/dashboard?level=${level.id}`;
                      }}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Level Completed
                        </>
                      ) : (
                        <>
                          Continue Learning
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                )}
                
                {isLocked && (
                  <CardContent>
                    <div className="text-center py-4">
                      <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Complete {levels[index - 1]?.name} to unlock this level
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Next Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>What to do next in your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">1</div>
            <p className="text-sm">Continue with your current level ({activeLevel?.name}) - {activeLevel?.completedModules}/{activeLevel?.modules} modules completed</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">2</div>
            <p className="text-sm">Attend live classes every Saturday at {activeLevel?.classTime}</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">3</div>
            <p className="text-sm">Complete all modules to unlock the next level</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
