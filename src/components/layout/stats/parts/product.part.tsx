'use client';

import { StatisticsCard } from '@/components/layout/stats/card.stat';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { Stats } from '@/types/stats-data';
import { memo, useMemo } from 'react';
import { LabelList, RadialBar, RadialBarChart } from 'recharts';

const TEXT_STYLES = {
  label: 'text-xs text-muted-foreground',
  value: 'text-sm font-medium',
  header: 'text-sm font-medium',
  badge: 'text-xs',
} as const;

interface ProductStatsProps {
  stats: Stats;
  className?: string;
}

export const ProductStats = memo(function ProductStats({ stats, className }: ProductStatsProps) {
  // Gabungkan top products dan products lainnya, hindari duplikasi
  const allProducts = useMemo(() => {
    const topProductNames = stats.topProducts.map((p) => p.product);
    const otherProducts = stats.products.filter((p) => !topProductNames.includes(p.product));
    return [...stats.topProducts, ...otherProducts];
  }, [stats.topProducts, stats.products]);

  // Transform data untuk radial chart
  const chartData = useMemo(() => {
    return allProducts.map((product, index) => ({
      product: product.product,
      total: product.total,
      fill: `var(--color-product-${index + 1})`,
    }));
  }, [allProducts]);

  // Chart config untuk radial chart
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      total: {
        label: 'Tests',
      },
    };

    // Tambahkan konfigurasi untuk setiap produk
    allProducts.forEach((product, index) => {
      config[`product-${index + 1}`] = {
        label: product.product,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });

    return config;
  }, [allProducts]) satisfies ChartConfig;

  return (
    <StatisticsCard
      title="Product Distribution"
      className={className}
      titleExtra={
        <Badge variant="outline" className={TEXT_STYLES.badge}>
          {stats.topProducts[0]?.product || 'No Product'}
        </Badge>
      }
    >
      <ChartContainer config={chartConfig} className="aspect-square">
        <RadialBarChart data={chartData} startAngle={-90} endAngle={380} innerRadius={50} outerRadius={250}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="product" />} />
          <RadialBar dataKey="total" background>
            <LabelList
              position="insideStart"
              dataKey="product"
              className="fill-background capitalize mix-blend-luminosity"
              fontSize={12}
            />
          </RadialBar>
        </RadialBarChart>
      </ChartContainer>
    </StatisticsCard>
  );
});

ProductStats.displayName = 'ProductStats';
