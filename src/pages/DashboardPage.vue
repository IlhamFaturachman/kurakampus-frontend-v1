<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-ma-none">Dashboard</h1>
        <p class="text-grey-7 q-mb-none">Welcome back, {{ user?.firstName }}!</p>
      </div>
      <div class="col-auto">
        <q-btn flat round icon="refresh" color="primary" @click="refreshData" :loading="loading">
          <q-tooltip>Refresh Data</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-overline text-grey-7">Total Users</div>
                <div class="text-h4 text-weight-bold">{{ stats.totalUsers }}</div>
                <div class="text-caption text-positive">
                  <q-icon name="trending_up" size="xs" />
                  +12% from last month
                </div>
              </div>
              <div class="col-auto">
                <q-avatar size="56px" color="primary" text-color="white" icon="people" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-overline text-grey-7">Active Sessions</div>
                <div class="text-h4 text-weight-bold">{{ stats.activeSessions }}</div>
                <div class="text-caption text-positive">
                  <q-icon name="trending_up" size="xs" />
                  +8% from last week
                </div>
              </div>
              <div class="col-auto">
                <q-avatar size="56px" color="secondary" text-color="white" icon="timeline" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-overline text-grey-7">Revenue</div>
                <div class="text-h4 text-weight-bold">${{ stats.revenue }}</div>
                <div class="text-caption text-negative">
                  <q-icon name="trending_down" size="xs" />
                  -3% from last month
                </div>
              </div>
              <div class="col-auto">
                <q-avatar size="56px" color="positive" text-color="white" icon="attach_money" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-overline text-grey-7">Conversion Rate</div>
                <div class="text-h4 text-weight-bold">{{ stats.conversionRate }}%</div>
                <div class="text-caption text-positive">
                  <q-icon name="trending_up" size="xs" />
                  +5% from last month
                </div>
              </div>
              <div class="col-auto">
                <q-avatar size="56px" color="info" text-color="white" icon="analytics" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Revenue Chart -->
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Revenue Overview</div>
            <div class="text-caption text-grey-7">Monthly revenue for the last 6 months</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="chart-container">
            <canvas ref="revenueChart"></canvas>
          </q-card-section>
        </q-card>
      </div>

      <!-- User Growth Chart -->
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">User Distribution</div>
            <div class="text-caption text-grey-7">By user role</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="chart-container">
            <canvas ref="userChart"></canvas>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Activity & Recent Items -->
    <div class="row q-col-gutter-md">
      <!-- Recent Activity -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
            <div class="text-caption text-grey-7">Latest user activities</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="(activity, index) in recentActivity" :key="index" clickable v-ripple>
              <q-item-section avatar>
                <q-avatar :color="activity.color" text-color="white" :icon="activity.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ activity.title }}</q-item-label>
                <q-item-label caption>{{ activity.description }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>{{ activity.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Quick Actions & Top Items -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Quick Actions</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-btn
                  unelevated
                  color="primary"
                  icon="person_add"
                  label="Add User"
                  class="full-width"
                  @click="quickAction('add-user')"
                />
              </div>
              <div class="col-6">
                <q-btn
                  unelevated
                  color="secondary"
                  icon="article"
                  label="New Report"
                  class="full-width"
                  @click="quickAction('new-report')"
                />
              </div>
              <div class="col-6">
                <q-btn
                  unelevated
                  color="info"
                  icon="settings"
                  label="Settings"
                  class="full-width"
                  @click="quickAction('settings')"
                />
              </div>
              <div class="col-6">
                <q-btn
                  unelevated
                  color="positive"
                  icon="cloud_download"
                  label="Export Data"
                  class="full-width"
                  @click="quickAction('export')"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Top Performing Items</div>
            <div class="text-caption text-grey-7">Based on activity</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="(item, index) in topItems" :key="index">
              <q-item-section avatar>
                <q-avatar color="grey-4" text-color="grey-8">
                  {{ index + 1 }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>
                  <q-linear-progress :value="item.score / 100" color="primary" class="q-mt-xs" />
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="item.score > 80 ? 'positive' : 'warning'">
                  {{ item.score }}%
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { Notify } from 'quasar';
  import { Chart, registerables } from 'chart.js';

  Chart.register(...registerables);

  const authStore = useAuthStore();
  const user = authStore.user;
  const loading = ref(false);

  // Statistics data
  const stats = ref({
    totalUsers: 1247,
    activeSessions: 342,
    revenue: 24567,
    conversionRate: 3.24,
  });

  // Recent activity data
  const recentActivity = ref([
    {
      icon: 'person_add',
      color: 'primary',
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '5 min ago',
    },
    {
      icon: 'shopping_cart',
      color: 'positive',
      title: 'New purchase',
      description: 'Order #1234 completed',
      time: '12 min ago',
    },
    {
      icon: 'report_problem',
      color: 'warning',
      title: 'System alert',
      description: 'High memory usage detected',
      time: '1 hour ago',
    },
    {
      icon: 'update',
      color: 'info',
      title: 'System updated',
      description: 'Version 2.1.0 deployed',
      time: '3 hours ago',
    },
  ]);

  // Top items data
  const topItems = ref([
    { name: 'Product Alpha', score: 95 },
    { name: 'Service Beta', score: 87 },
    { name: 'Feature Gamma', score: 82 },
    { name: 'Module Delta', score: 76 },
  ]);

  // Chart refs
  const revenueChart = ref<HTMLCanvasElement | null>(null);
  const userChart = ref<HTMLCanvasElement | null>(null);

  let revenueChartInstance: Chart | null = null;
  let userChartInstance: Chart | null = null;

  // Initialize charts
  const initCharts = () => {
    // Revenue Chart (Line)
    if (revenueChart.value) {
      const ctx = revenueChart.value.getContext('2d');
      if (ctx) {
        revenueChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
              {
                label: 'Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => '$' + value,
                },
              },
            },
          },
        });
      }
    }

    // User Distribution Chart (Doughnut)
    if (userChart.value) {
      const ctx = userChart.value.getContext('2d');
      if (ctx) {
        userChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Admin', 'User', 'Moderator', 'Guest'],
            datasets: [
              {
                data: [45, 789, 123, 290],
                backgroundColor: ['#1976d2', '#26a69a', '#9c27b0', '#ffa726'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          },
        });
      }
    }
  };

  // Refresh data
  const refreshData = async () => {
    loading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update stats with random values
      stats.value = {
        totalUsers: Math.floor(Math.random() * 2000) + 1000,
        activeSessions: Math.floor(Math.random() * 500) + 200,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        conversionRate: parseFloat((Math.random() * 5 + 1).toFixed(2)),
      };

      Notify.create({
        type: 'positive',
        message: 'Data refreshed successfully',
        position: 'top',
        timeout: 2000,
      });
    } catch (_error) {
      Notify.create({
        type: 'negative',
        message: 'Failed to refresh data',
        position: 'top',
        timeout: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  // Quick actions
  const quickAction = (action: string) => {
    Notify.create({
      type: 'info',
      message: `Quick action: ${action}`,
      position: 'top',
      timeout: 2000,
    });
  };

  onMounted(() => {
    initCharts();
  });

  onUnmounted(() => {
    // Cleanup charts
    if (revenueChartInstance) {
      revenueChartInstance.destroy();
    }
    if (userChartInstance) {
      userChartInstance.destroy();
    }
  });
</script>

<style scoped lang="scss">
  .stat-card {
    transition:
      transform 0.2s,
      box-shadow 0.2s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .chart-container {
    height: 300px;
    position: relative;
  }
</style>
