import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ClientesRoutingModule } from './clientes.routing';

import { ClientesComponent } from './componentes/clientes.component';

import { ActividadesEconomicasModule } from '../../../personas/actividadeseconomicas/actividadesEconomicas.module';
import { LovClientesModule } from '../../lov/clientes/lov.clientes.module';
import { LovActividadEconomicaModule } from '../../../personas/lov/actividadeconomica/lov.actividadEconomica.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';

import { InformacionGeneralModule } from './submodulos/infgeneral/_informacionGeneral.module';
import { ClienteDireccionModule } from './submodulos/direccion/_clienteDireccion.module';
import { ClienteRefBancariaModule } from './submodulos/refbancaria/_clienteRefBancaria.module';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, ClientesRoutingModule, ActividadesEconomicasModule, LovClientesModule,  
    LovActividadEconomicaModule, InformacionGeneralModule, ClienteDireccionModule, ClienteRefBancariaModule, 
    LovPersonasModule, LovCuentasContablesModule],
  declarations: [ClientesComponent]
})
export class ClientesModule { }
