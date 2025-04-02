"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "completed" | "pending" | "late";
}

export default function AssignmentsPage() {
  const [assignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "수학 문제 풀이",
      description: "교재 78페이지 - 96페이지 문제를 풀고 제출하세요.",
      dueDate: "2024-04-10",
      status: "pending",
    },
    {
      id: "2",
      title: "역사 에세이",
      description: "한국 근대사에 대한 에세이를 작성하세요. (최소 1000자)",
      dueDate: "2024-04-15",
      status: "pending",
    },
    {
      id: "3",
      title: "물리학 실험 보고서",
      description: "이번 주 물리학 실험에 대한 보고서를 작성하세요.",
      dueDate: "2024-04-05",
      status: "late",
    },
    {
      id: "4",
      title: "영어 발표",
      description: "좋아하는 영화에 대한 영어 발표를 준비하세요.",
      dueDate: "2024-03-30",
      status: "completed",
    },
  ]);

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "late":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const getStatusText = (status: Assignment["status"]) => {
    switch (status) {
      case "completed":
        return "완료";
      case "pending":
        return "진행 중";
      case "late":
        return "지연";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "late":
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">과제 관리</h1>
        <Link href="/">
          <Button variant="outline">홈으로</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{assignment.title}</CardTitle>
                <Badge className={`ml-2 ${getStatusColor(assignment.status)}`}>
                  <span className="flex items-center">
                    {getStatusIcon(assignment.status)}
                    {getStatusText(assignment.status)}
                  </span>
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {assignment.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>마감일: {assignment.dueDate}</span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  상세 보기
                </Button>
                <Button className="flex-1">제출하기</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
