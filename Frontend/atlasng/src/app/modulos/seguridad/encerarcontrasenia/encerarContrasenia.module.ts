import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { EncerarContraseniaRoutingModule } from './encerarContrasenia.routing';

import { EncerarContraseniaComponent } from './componentes/encerarContrasenia.component';
import { LovUsuariosModule } from '../lov/usuarios/lov.usuarios.module';

@NgModule({
  imports: [SharedModule, EncerarContraseniaRoutingModule, LovUsuariosModule],
  declarations: [EncerarContraseniaComponent]
})
export class EncerarContraseniaModule { }
