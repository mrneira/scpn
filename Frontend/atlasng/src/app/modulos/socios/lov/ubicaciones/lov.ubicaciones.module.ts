import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovUbicacionesRoutingModule } from './lov.ubicaciones.routing';
import { LovDistritosModule } from './../../../generales/lov/distritos/lov.distritos.module';
import { TreeTableModule} from 'primeng/primeng';
import { LovUbicacionesComponent } from './componentes/lov.ubicaciones.component';

@NgModule({
  imports: [SharedModule, LovUbicacionesRoutingModule, TreeTableModule, LovDistritosModule],
  declarations: [LovUbicacionesComponent],
  exports: [LovUbicacionesComponent],
})
export class LovUbicacionesModule { }

