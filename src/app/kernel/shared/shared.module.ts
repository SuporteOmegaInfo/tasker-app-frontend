import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxMaskModule } from 'ngx-mask'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ToastrModule } from 'ngx-toastr';

import { AddProjectButtonFormComponent } from './components/forms/add-project-button-form/add-project-button-form.component';
import { FormCheckboxComponent } from './components/forms/inputs/form-checkbox/form-checkbox.component';
import { FormDatepickerComponent } from './components/forms/inputs/form-datepicker/form-datepicker.component';
import { FormFieldErrorComponent } from './components/forms/inputs/form-field-error/form-field-error.component';
import { FormInputGroupComponent } from './components/forms/inputs/form-input-group/form-input-group.component';
import { FormInputComponent } from './components/forms/inputs/form-input/form-input.component';
import { FormSelectComponent } from './components/forms/inputs/form-select/form-select.component';
import { FormTextareaComponent } from './components/forms/inputs/form-textarea/form-textarea.component';
import { FormTimepickerComponent } from './components/forms/inputs/form-timepicker/form-timepicker.component';
import { BreadcrumbComponent } from './components/ui/breadcrumb/breadcrumb.component';
import { CarouselComponent } from './components/ui/carousel/carousel.component';
import { ComponentSliderComponent } from './components/ui/component-slider/component-slider.component';
import { MiniLoaderComponent } from './components/ui/mini-loader/mini-loader.component';
import { AddAnotationModalComponent } from './components/ui/modal/lib/add-anotation-modal/add-anotation-modal.component';
import { AddChecklistItemComponent } from './components/ui/modal/lib/add-checklist-item/add-checklist-item.component';
import { ConfirmComponent } from './components/ui/modal/lib/confirm/confirm.component';
import { ModalComponent } from './components/ui/modal/modal/modal.component';
import { NavbarComponent } from './components/ui/navbar/navbar.component';
import { PageLoaderComponent } from './components/ui/page-loader/page-loader.component';
import { SidebarComponent } from './components/ui/sidebar/sidebar.component';
import { TableDefaultComponent } from './components/ui/table/table-default/table-default.component';
import { TableFieldComponent } from './components/ui/table/table-field/table-field.component';
import { TablePaginatorComponent } from './components/ui/table/table-paginator/table-paginator.component';
import { ScrollHeaderDirective } from './directives/scroll-header.directive';
import { MembersModalComponent } from './components/ui/modal/lib/members-modal/members-modal.component';
import { FormColorpickerComponent } from './components/forms/inputs/form-colorpicker/form-colorpicker.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    BreadcrumbComponent,
    CarouselComponent,
    MiniLoaderComponent,
    PageLoaderComponent,
    ModalComponent,
    ConfirmComponent,
    AddChecklistItemComponent,
    AddAnotationModalComponent,
    TableDefaultComponent,
    TableFieldComponent,
    TablePaginatorComponent,
    FormInputComponent,
    FormInputGroupComponent,
    FormSelectComponent,
    FormCheckboxComponent,
    FormTextareaComponent,
    FormFieldErrorComponent,
    ComponentSliderComponent,
    ScrollHeaderDirective,
    AddProjectButtonFormComponent,
    FormDatepickerComponent,
    FormTimepickerComponent,
    MembersModalComponent,
    FormColorpickerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDividerModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DragDropModule,
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    FullCalendarModule,
    ColorPickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule.setOpts('pt-BR'),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDividerModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DragDropModule,
    NgxMaskModule,
    ToastrModule,
    FullCalendarModule,
    ColorPickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,

    //Componnentes
    FormDatepickerComponent,
    FormTimepickerComponent,
    NavbarComponent,
    SidebarComponent,
    BreadcrumbComponent,
    CarouselComponent,
    MiniLoaderComponent,
    PageLoaderComponent,
    ModalComponent,
    ConfirmComponent,
    AddChecklistItemComponent,
    AddAnotationModalComponent,
    TableDefaultComponent,
    TableFieldComponent,
    TablePaginatorComponent,
    FormInputComponent,
    FormInputGroupComponent,
    FormSelectComponent,
    FormCheckboxComponent,
    FormTextareaComponent,
    FormFieldErrorComponent,
    ComponentSliderComponent,
    AddProjectButtonFormComponent,
    MembersModalComponent,
    FormColorpickerComponent,

    //Diretivas
    ScrollHeaderDirective,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic' } },
  ]
})
export class SharedModule { }
