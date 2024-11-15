import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ProveedoresRoutingModule } from './proveedores.routing';

import { ProveedoresComponent } from './componentes/proveedores.component';

import { ActividadesEconomicasModule } from '../../../personas/actividadeseconomicas/actividadesEconomicas.module';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { LovActividadEconomicaModule } from '../../../personas/lov/actividadeconomica/lov.actividadEconomica.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';

import { InformacionGeneralModule } from './submodulos/infgeneral/_informacionGeneral.module';
import { ProveedorDireccionModule } from './submodulos/direccion/_proveedorDireccion.module';
import { ProveedorRefBancariaModule } from './submodulos/refbancaria/_proveedorRefBancaria.module';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, ProveedoresRoutingModule, ActividadesEconomicasModule, LovProveedoresModule,  
    LovActividadEconomicaModule, InformacionGeneralModule, ProveedorDireccionModule, ProveedorRefBancariaModule, 
    LovPersonasModule, LovCuentasContablesModule],
  declarations: [ProveedoresComponent]
})
export class ProveedoresModule { }
