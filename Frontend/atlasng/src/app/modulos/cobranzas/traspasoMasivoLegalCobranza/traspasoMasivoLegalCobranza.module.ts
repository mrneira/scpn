import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TraspasoMasivoLegalCobranzaRoutingModule } from './traspasoMasivoLegalCobranza.routing';

import { TraspasoMasivoLegalCobranzaComponent } from './componentes/traspasoMasivoLegalCobranza.component';
import { LovUsuariosModule } from '../../seguridad/lov/usuarios/lov.usuarios.module';

@NgModule({
  imports: [SharedModule, TraspasoMasivoLegalCobranzaRoutingModule, LovUsuariosModule ],
  declarations: [TraspasoMasivoLegalCobranzaComponent]
})
export class TraspasoMasivoLegalCobranzaModule { }
