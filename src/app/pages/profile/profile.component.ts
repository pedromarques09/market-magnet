import { Router } from '@angular/router';
import { ValidationCallbackData } from 'devextreme/common';
import { UserModel } from 'src/app/shared/models/userModel';
import { AuthService } from 'src/app/shared/services';
import { UserStateService } from 'src/app/shared/services/user-state.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular/ui/form';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

type EditorOptions = DxTextBoxTypes.Properties;

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form!: DxFormComponent;
  colCountByScreen: any;
  user!: UserModel;
  userId!: string;
  userApi!: any;

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

  constructor(
    private authService: AuthService,
    private userStateService: UserStateService,
    private router: Router
  ) {
    this.colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
    };
  }
  editName = false;
  editPassword = false;
  showPassword = false;

  async ngOnInit() {
    this.userId = (await this.authService.getUser())?.data._id;
    this.loadUser();
  }

  async loadUser() {
    this.userApi = (await this.authService.getUserById(this.userId)).data;
    this.user = {
      name: this.userApi.name,
      email: this.userApi.email,
      password: this.userApi.password,
    };
  }

  changePasswordMode = (name: string) => {
    let editor = this.form.instance.getEditor(name);
    editor?.option(
      'mode',
      editor.option('mode') === 'text' ? 'password' : 'text'
    );
  };

  changePassword = () => {
    this.editPassword = !this.editPassword;
  };

  confirmPassword = (e: ValidationCallbackData) => {
    return e.value === this.user.password;
  };

  onSubmit(event: Event) {
    event.preventDefault();
    this.updateUser();
  }

  async updateUser() {
    const response = await this.authService.updateUser(this.user);
    if (response.isOk) {
      this.userStateService.updateUserName(this.user.name);
      this.router.navigate(['/home']);
    } else {
      console.log(response.message);
    }
  }
}
