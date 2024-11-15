import { NgModule } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoRemuneracionesRoutingModule } from './pagoRemuneraciones.routing';
import { PagoRemuneracionesComponent } from './componentes/pagoRemuneraciones.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';
import { LovPaisesModule } from '../../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../../generales/lov/cantones/lov.cantones.module';
import { LovCiudadesModule } from '../../../generales/lov/ciudades/lov.ciudades.module';

@NgModule({
  imports: [SharedModule, PagoRemuneracionesRoutingModule, JasperModule, LovFuncionariosModule,SpinnerModule,LovPaisesModule,LovProvinciasModule,
    LovCantonesModule,LovCiudadesModule],
  declarations: [PagoRemuneracionesComponent]
})
export class PagoRemuneracionesModule { }
