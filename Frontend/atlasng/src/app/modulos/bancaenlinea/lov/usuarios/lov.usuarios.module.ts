import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovUsuariosRoutingModule } from './lov.usuarios.routing';
import { LovUsuariosComponent } from './componentes/lov.usuarios.component';

@NgModule({
  imports: [SharedModule, LovUsuariosRoutingModule],
  declarations: [LovUsuariosComponent],
  exports: [LovUsuariosComponent]
})
export class LovUsuariosModule { }

