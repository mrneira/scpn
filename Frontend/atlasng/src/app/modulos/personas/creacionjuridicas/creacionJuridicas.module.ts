import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CreacionJuridicasRoutingModule } from './creacionJuridicas.routing';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovNacionalidadesModule } from '../../generales/lov/nacionalidades/lov.nacionalidades.module';
import { LovActividadEconomicaModule } from '../../personas/lov/actividadeconomica/lov.actividadEconomica.module';
import { LovPaisesModule } from '../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../generales/lov/cantones/lov.cantones.module';
import { LovParroquiasModule } from '../../generales/lov/parroquias/lov.parroquias.module';
import { LovCiudadesModule } from '../../generales/lov/ciudades/lov.ciudades.module';
import { PersonaRefComercialModule } from '../creacionnaturales/submodulos/refcomercial/_personaRefComercial.module';
import { PersonaDireccionModule } from '../creacionnaturales/submodulos/direccion/_personaDireccion.module';

import { CreacionJuridicasComponent } from './componentes/creacionJuridicas.component';
import { PersonaJuridicaComponent } from './componentes/_personaJuridica.component';
import { PersonaDetalleComponent } from './componentes/_personaDetalle.component';
import { InformacionGeneralComponent } from './componentes/_informacionGeneral.component';
import { PersonaSucursalComponent } from './componentes/_personaSucursal.component';
import { PersonaFirmanteComponent } from './componentes/_personaFirmante.component';
import { InformacionFinancieraComponent } from './componentes/_informacionFinanciera.component';


@NgModule({
  imports: [SharedModule, CreacionJuridicasRoutingModule, LovPersonasModule, LovNacionalidadesModule, LovActividadEconomicaModule,
            LovPaisesModule, LovProvinciasModule, LovCantonesModule, LovParroquiasModule, LovCiudadesModule,
            PersonaRefComercialModule, PersonaDireccionModule ],
  declarations: [CreacionJuridicasComponent, PersonaJuridicaComponent, PersonaDetalleComponent, InformacionGeneralComponent,
                 PersonaSucursalComponent, PersonaFirmanteComponent, InformacionFinancieraComponent]
})
export class CreacionJuridicasModule { }
