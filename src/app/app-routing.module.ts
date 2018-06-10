import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderComponent } from "./reader/reader.component";

const routes: Routes = [
  { path: "", redirectTo: "/read", pathMatch: "full" },
  { path: "read", component: ReaderComponent }
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
