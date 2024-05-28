import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';   
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from './api.service';
import { UtilsComponent } from '../components/shared/utils/utils.component';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let snackBar: MatSnackBar;
  let utils: UtilsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, MatSnackBarModule],
      providers: [ApiService, UtilsComponent, MatSnackBar]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    snackBar = TestBed.inject(MatSnackBar);
    utils = TestBed.inject(UtilsComponent);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetchUserInfo', () => {
    it('should return cached data if available', () => {
      const userName = 'testuser';
      const cacheKey = `userInfo-${userName}`;
      const mockResponse = { data: 'test data' };
      service['cache'][cacheKey] = mockResponse;

      service.fetchUserInfo(userName).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
    });

    it('should fetch data from API if not in cache', () => {
      const mockUser = { login: 'testuser' };
      const cacheKey = `userInfo-${mockUser.login}`;

      service.fetchUserInfo(mockUser.login).subscribe(response => {
        expect(response.body).toEqual(mockUser);
        expect(service['cache'][cacheKey]).toEqual(response);
      });

      const req = httpMock.expectOne(service.API_URL + 'users/' + mockUser.login);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser, { status: 200, statusText: 'OK' });
      
    });
  });

  describe('#fetchUserRepos', () => {
    it('should return cached data if available', () => {
      const user = 'testuser';
      const itemsPerPage = 5;
      const page = 1;
      const cacheKey = `userRepos-${user}-${itemsPerPage}-${page}`;
      const mockResponse = { data: 'test data' };
      service['cache'][cacheKey] = mockResponse;

      service.fetchUserRepos(user, itemsPerPage, page).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
    });

    it('should fetch data from API if not in cache', () => {
      const mockRepos = [{ id: 1, name: 'repo1' }];
      const cacheKey = `userRepos-testuser-10-1`;

      service.fetchUserRepos('testuser', 10, 1).subscribe(response => {
        expect(response.body).toEqual(mockRepos);
        expect(service['cache'][cacheKey]).toEqual(response);
      });

      const req = httpMock.expectOne(service.API_URL + 'users/testuser/repos?per_page=10&page=1');
      expect(req.request.method).toBe('GET');
      req.flush(mockRepos, { status: 200, statusText: 'OK' });
    });
  });

  describe('#handleError', () => {
    it('should display "Invalid User!" message for 404 error', () => {
      spyOn(utils, 'stopLoader');
      spyOn(snackBar, 'open');

      service['handleError']({ status: 404 });

      expect(utils.stopLoader).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith('Invalid User! Please try valid user name', 'X');
    });

    it('should display "API rate limit exceeded" message for 403 error', () => {
      spyOn(utils, 'stopLoader');
      spyOn(snackBar, 'open');

      service['handleError']({ status: 403 });

      expect(utils.stopLoader).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith('API rate limit exceeded', 'X');
    });

    it('should display "No Internet Connection" message for 0 error', () => {
      spyOn(utils, 'stopLoader');
      spyOn(snackBar, 'open');

      service['handleError']({ status: 0 });

      expect(utils.stopLoader).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith('No Internet Connection', 'X');
    });

    it('should display "An unknown error occurred!" message for other errors', () => {
      spyOn(utils, 'stopLoader');
      spyOn(snackBar, 'open');

      service['handleError']({ status: 500 });

      expect(utils.stopLoader).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith('An unknown error occurred!', 'X');
    });
  });
});




