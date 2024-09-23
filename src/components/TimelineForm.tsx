"use client";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import { cn } from "@/lib/utils";
import { useAppState } from "@/provider/AppProvider";
import {
  Container,
  FileText,
  ListChecks,
  Megaphone,
} from "lucide-react";
import React, { useEffect } from "react";

interface TimelineFormProps {
  data?: any;
  index?: number;
}

const TimelineForm: React.FC<TimelineFormProps> = ({ data }) => {
  const context = useAppState();
  const isDetailPage = useIsDetailPage() && !context.isEditPage;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, handler: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };

  return (
    <div className="flex justify-center gap-20 py-5 border-b">
      <div
        className={cn(
          "flex flex-col items-center gap-2 cursor-pointer",
          context.formIndex <= 1 ? "text-primary" : "text-muted-foreground"
        )}
        onClick={() => { context.handleSpecificForm(0) }}
        onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(0))}
        role="button"
        tabIndex={0}
      >
        <Megaphone width={50} height={50} />
        <p className="text-xs font-medium">Notification Data</p>
      </div>
      <div
        className={cn(
          "flex flex-col items-center gap-2 cursor-pointer",
          context.formIndex == 2 ? "text-primary" : "text-muted-foreground"
        )}
        onClick={() => {
          if (data) {
            console.log(data);
            context.setRequestDetailForm(data);
          }
          context.handleSpecificForm(context.containerIdActive ? 2 : 0);
        }}
        onKeyDown={(e) => handleKeyDown(e, () => {
          if (data) {
            console.log(data);
            context.setRequestDetailForm(data);
          }
          context.handleSpecificForm(context.containerIdActive ? 2 : 0);
        })}
        role="button"
        tabIndex={0}
      >
        <Container width={50} height={50} />
        <p className="text-xs font-medium">
          {context.isContainer ? "Container" : "Non Container"} Data
        </p>
      </div>
      <div
        className={cn(
          "flex flex-col items-center gap-2 cursor-pointer",
          context.formIndex == 3 ? "text-primary" : "text-muted-foreground"
        )}
        onClick={() => context.handleSpecificForm(context.containerIdActive ? 3 : 0)}
        onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(context.containerIdActive ? 3 : 0))}
        role="button"
        tabIndex={0}
      >
        <FileText width={50} height={50} />
        <p className="text-xs font-medium">Document Data</p>
      </div>
      {!isDetailPage && (
        <div
          className={cn(
            "flex flex-col items-center gap-2 cursor-pointer",
            context.formIndex == 4 ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => context.handleSpecificForm(context.containerIdActive ? 4 : 0)}
          onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(context.containerIdActive ? 4 : 0))}
          role="button"
          tabIndex={0}
        >
          <ListChecks width={50} height={50} />
          <p className="text-xs font-medium">Checkpoint</p>
        </div>
      )}
    </div>
  );
};

export default TimelineForm;