import { tooltip, tooltipAlert } from './tooltip.js';

class UserAuth {
    constructor(start_url) {
        this.URL = start_url;
        this.field = document.getElementById("username-field");
        this.currentUserObj = null;
        this.loggedin = false;
    }

    login() {
        fetch(this.URL + "/ajax/user.php?ajax=true", {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                this.field.innerHTML = null;

                const name = document.createElement('span');
                name.innerText = response.user;
                name.style.paddingRight = "10px";

                this.field.appendChild(name);
                this.field.setAttribute("href", this.URL + "/acc/creations");

                if (response.alert != null && response.alert != undefined && response.alert != 0) {
                    const notification = document.createElement('span');
                    notification.innerText = response.alert;
                    notification.classList.add('user-notif-count');

                    this.field.appendChild(notification);
                }

                this.currentUser(response);
                tooltip('Logged in as ' + response.user);
            } else {
                console.error("An error occured while authenticating: " + response.error);
                document.getElementById("username-field").innerHTML = "Login";
                this.loggedin = false;
            }
            this.ui_login(response);
        })
        .catch(async (err) => {
            this.loggedin = false;
            try {
                let res = await err.response.json();
                console.error(res.error);
                this.ui_login(res);
            } catch {
                console.error("An error occured while authenticating: " + err);
                this.ui_login(null);
            }
        });
    }

    getWarnStatus() {
        fetch(this.URL + "/ajax/user.php?get_warn_status=true", {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(response => {
            if (response.status == "yes" && response.success == true) {
                tooltipAlert(response.text, response.reason, response.additional, response.button);

                // rerun login function to update user information (logging user out if they get banned instead of just warned)
                this.login();
            } else if (response.success == false) {
                console.error("An error occured while authenticating: " + response.error);
            }
        })
        .catch(async (err) => {
            try {
                const res = await err.response.json();
                console.error("An error occured while authenticating: " + res.error);
            } catch {
                console.error("An error occured while authenticating: " + err);
            }
        });
    }

    currentUser(response) {
        this.loggedin = true;

        this.currentUserObj = {
            'userid': response.id,
            'username': response.user,
            'picture': this.URL + response.pfp,
            'verified': response.is_verified,
        }
    }

    ui_login(response) {
        let yams = {
            'container': document.querySelector('#settings-account-auth'),
            'logout': document.querySelector('#settings-account-loggedout'),
            'username': document.querySelector('#settings-account-auth .username'),
            'pfp': document.querySelector('#settings-account-auth .pfp'),
            'pfpImg': document.querySelector('#settings-account-auth .pfp img'),
            'stats': document.querySelector('#settings-account-auth .stats'),
            'statsFollowing': document.querySelector('#settings-account-auth .stats .following .stat'),
            'statsFollowers': document.querySelector('#settings-account-auth .stats .followers .stat'),
            'notVerified': document.querySelector('#settings-account-auth .notverified'),
        };

        yams.container.style.display = 'block';

        if (response && !response.error && response.success) {
            yams.logout.style.display = 'none';

            if (response.user) {
                yams.username.textContent = response.user;
                yams.username.style.display = 'block';
            }

            if (response.pfp) {
                yams.pfpImg.src = this.URL + response.pfp;
                yams.pfp.style.display = 'block';
            }

            if(response.stats && response.stats.following && response.stats.followers) {
                yams.stats.style.display = 'block';
                yams.statsFollowing.innerText = response.stats.following;
                yams.statsFollowers.innerText = response.stats.followers;
            }

            if(response.is_verified !== true) {
                yams.notVerified.style.display = 'block';
            }
        } else {
            yams.pfp.style.display = 'none';
            yams.username.style.display = 'none';
            yams.stats.style.display = 'none';
            yams.notVerified.style.display = 'none';

            yams.logout.style.display = 'block';
            yams.logout.querySelector('.message').textContent = 'Logged out';
            yams.logout.querySelector('.text').innerHTML = `Log in to an account to save creations to node <a href="${this.URL}"><b>${this.URL}</b></a>`;
        }
    }
}

export { UserAuth };