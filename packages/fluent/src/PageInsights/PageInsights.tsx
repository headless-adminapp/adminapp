import { InsightsProvider } from '@headless-adminapp/app/insights/InsightsProvider';
import {
  InsightExpereince,
  InsightLookup,
} from '@headless-adminapp/core/experience/insights';
import { useMemo } from 'react';

import { InsightsContainer } from '../Insights/InsightsContainer';

export function createInsightLookup(
  insights: InsightExpereince[]
): InsightLookup[] {
  return insights.map((insight) => ({
    id: insight.id,
    title: insight.title,
    subtitle: insight.subtitle,
  }));
}

interface PageInsightsProps {
  insights: InsightExpereince[];
  insightId: string;
  onChangeInsight: (id: string) => void;
}

export function PageInsights({
  insightId,
  insights,
  onChangeInsight,
}: Readonly<PageInsightsProps>) {
  const insightExpereince = useMemo(() => {
    return insights.find((insight) => insight.id === insightId);
  }, [insightId, insights]);

  const insightLookups = useMemo(
    () => createInsightLookup(insights),
    [insights]
  );

  if (!insightExpereince) {
    return null;
  }

  return (
    <InsightsProvider
      experience={insightExpereince}
      insightLookup={insightLookups}
      onInsightSelect={onChangeInsight}
    >
      <InsightsContainer />
    </InsightsProvider>
  );
}
