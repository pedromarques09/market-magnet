import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ValidationCallbackData } from 'devextreme-angular/common';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from 'src/app/shared/services';
import { DxFormComponent } from 'devextreme-angular/ui/form';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import { UserModel } from '../../models/userModel';

type EditorOptions = DxTextBoxTypes.Properties;
@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss'],
})
export class CreateAccountFormComponent {
  @ViewChild(DxFormComponent, { static: false }) form!: DxFormComponent;
  loading = false;
  formData!: UserModel;

  constructor(private authService: AuthService, private router: Router) {}
  passwordEditorOptions: EditorOptions = {
    mode: 'password',
    valueChangeEvent: 'keyup',
    buttons: [
      {
        name: 'password',
        location: 'after',
        options: {
          icon: 'eyeopen',
          stylingMode: 'text',
          onClick: () => this.changePasswordMode('password'),
        },
      },
    ],
  };

  confirmPasswordEditorOptions: EditorOptions = {
    mode: 'password',
    valueChangeEvent: 'keyup',
    buttons: [
      {
        name: 'password',
        location: 'after',
        options: {
          icon: 'eyeopen',
          stylingMode: 'text',
          onClick: () => this.changePasswordMode('confirmPassword'),
        },
      },
    ],
  };
  async onSubmit(e: Event) {
    e.preventDefault();
    const { name, email, password } = this.formData;
    this.loading = true;

    const result = await this.authService.createAccount(name, email, password);
    this.loading = false;

    if (result.isOk) {
      this.router.navigate(['/login-form']);
    } else {
      notify(result.message, 'error', 2000);
    }
  }

  changePasswordMode = (name: string) => {
    console.log('chegou aqui' + name);
    let editor = this.form.instance.getEditor(name);
    console.log(editor);
    editor?.option(
      'mode',
      editor.option('mode') === 'text' ? 'password' : 'text'
    );
  };

  confirmPassword = (e: ValidationCallbackData) => {
    return e.value === this.formData.password;
  };
}
@NgModule({
  imports: [CommonModule, RouterModule, DxFormModule, DxLoadIndicatorModule],
  declarations: [CreateAccountFormComponent],
  exports: [CreateAccountFormComponent],
})
export class CreateAccountFormModule {}
