import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogDocumentosElectronicosComponent } from './componentes/logDocumentosElectronicos.component';

const routes: Routes = [
  { path: '', component: LogDocumentosElectronicosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogDocumentosElectronicosRoutingModule {}
