import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

export const appRoutes: Routes = [
    { path: '', component: AppComponent },
    { path: '**', redirectTo: '/', pathMatch: 'full' }
];

export const mainRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(appRoutes);
export class RootModule { }
