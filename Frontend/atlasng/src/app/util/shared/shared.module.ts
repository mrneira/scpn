import { NgModule } from '@angular/core';

import { BasicModule } from './basic.module';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';

import { AccionesDialogoComponent } from './componentes/accionesDialogo.component';
import { AccionesConsultaComponent } from './componentes/accionesConsulta.component';
import { AccionesCabeceraComponent } from './componentes/accionesCabecera.component';
import { AccionesEditarComponent } from './componentes/accionesEditar.componente';
import { AccionesRegistroComponent } from './componentes/accionesRegistro.component';
import { AccionesReporteComponent } from './componentes/accionesReporte.component';
import { AccionesEtapaComponent } from './componentes/accionesEtapa.component';
import { AccionesCobranzasBuzonComponent } from './componentes/accionesCobranzasBuzon';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [BasicModule, SplitButtonModule,TooltipModule],
  declarations: [AccionesDialogoComponent,AccionesConsultaComponent, AccionesCabeceraComponent, AccionesEditarComponent, AccionesRegistroComponent,
  AccionesReporteComponent, AccionesEtapaComponent,AccionesCobranzasBuzonComponent],
  exports: [BasicModule, AccionesDialogoComponent,TooltipModule, AccionesConsultaComponent, AccionesCabeceraComponent, AccionesEditarComponent, AccionesRegistroComponent,
  AccionesReporteComponent, AccionesEtapaComponent,AccionesCobranzasBuzonComponent]
})
export class SharedModule { }
