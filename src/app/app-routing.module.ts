import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderComponent } from "./reader/reader.component";
import { StatusComponent } from "./status/status.component";

const routes: Routes = [
  { path: "", redirectTo: "/read", pathMatch: "full" },
  { path: "read", component: ReaderComponent, data: { state: 'read' } },
  { path: "character", component: StatusComponent, data: { state: 'character' } },
  { path: '**', redirectTo: "/read" }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
