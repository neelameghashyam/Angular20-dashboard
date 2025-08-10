import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MainDashboard } from './pages/main-dashboard/main-dashboard';
import { Users } from './pages/users/users';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: MainDashboard }, 
      { path: 'users', component: Users },    
      { path: '**', redirectTo: '/errors/404' } 
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
