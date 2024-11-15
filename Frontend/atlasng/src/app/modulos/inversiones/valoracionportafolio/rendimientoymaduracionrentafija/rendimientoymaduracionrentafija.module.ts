import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RendimientoymaduracionrentafijaRouting } from './rendimientoymaduracionrentafija.routing';
import { RendimientoMaduracionRentaFija } from './componentes/rendimientoymaduracionrentafija.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, RendimientoymaduracionrentafijaRouting, JasperModule ],
  declarations: [RendimientoMaduracionRentaFija]
})
export class RendimientoymaduracionrentafijaModule { }
