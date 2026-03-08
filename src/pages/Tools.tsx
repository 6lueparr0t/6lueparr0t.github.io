import React from "react";

import { Link } from "react-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ToolsPage: React.FC = () => {
  return (
    <div className="p-8 min-h-[calc(100vh-4.2rem)] flex flex-col">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tools</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/tools/plain-text">
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle>MD to Text</CardTitle>
                <CardDescription>Gemini, Chatgpt 의 마크다운 문법을 제거합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>마크다운 서식을 지우고, 특정 단어를 필터링</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/tools/roulette">
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle>룰렛</CardTitle>
                <CardDescription>돌려돌려 돌림판~</CardDescription>
              </CardHeader>
              <CardContent>
                <p>항목을 추가하고 가중치를 설정한 뒤, 룰렛을 돌려 당첨자를 뽑아보세요.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
