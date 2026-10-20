/**
 * Class to display parts
 * Better replacement for old displayParts function
 */
class search_display_partui {
    constructor(ldraw_icon_path) {
        this.sentinel = null;
        this.observer = null
        this.max_load_amount = 50;
        this.select_block_contain = document.getElementById("select-block");
        this.cutespinny = document.getElementById('cutespinny');
        this.current_index = 0;
        this.is_rendering = false;
        this.is_custom = false;
        this.ldraw_icon_path = ldraw_icon_path;
    }

    displayParts(displayed_parts, new_category, custom = false) {
        this.is_custom = custom;

        if(custom && displayed_parts.error) {
            console.error('error fetching custom parts ' + displayed_parts.code);
            let error = displayed_parts?.message || "Something went wrong.";

            if(displayed_parts.code == "LOGGED_OUT") {
                error = "Please login to view and add custom parts to the scene.";
            }

            if(displayed_parts.code == "INV_LOGIN") {
                error = "Invalid login.";
            }

            if(displayed_parts.code == "USR_NOT_VERIFY") {
                error = "Please verify your account to view and add custom parts to the scene.";
            }

            if(displayed_parts.code == "NO_PARTS") {
                error = "No parts found in query.";
            }

            tooltip(error);
            return;
        }

        if(!custom) {
            displayed_parts = displayed_parts.sort((a, b) => a.name.length - b.name.length);
        }

        if (new_category) {
            if (this.observer) {
                this.observer.disconnect();
            }

            this.max_load_amount = 50;
            this.current_index = 0;

            let existingSpans = this.select_block_contain.querySelectorAll('span');
            existingSpans.forEach(span => span.remove());

            this.prepare(displayed_parts);
            this.render(displayed_parts);
        } else {
            this.render(displayed_parts);
        }
    }

    prepare(displayed_parts) {
        let oldSentinel = document.getElementById('scroll-sentinel');
        if (oldSentinel) {
            oldSentinel.remove();
        };

        this.sentinel = document.createElement('div');
        this.sentinel.id = 'scroll-sentinel';
        this.sentinel.style.height = '1px';
        this.select_block_contain.appendChild(this.sentinel);

        this.observer = this.create_observer(displayed_parts);
        this.observer.observe(this.sentinel);
    }

    create_observer(displayed_parts) {
        return new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                if (this.current_index < displayed_parts.length) {
                    requestAnimationFrame(() => this.render(displayed_parts));
                }
            }
        }, { rootMargin: '100px' });
    }

    render(displayed_parts) {
        if (this.is_rendering) {
            return;
        }
        this.is_rendering = true;
        this.cutespinny.style.display = 'block';

        let loadLimit = Math.min(this.current_index + this.max_load_amount, displayed_parts.length);
        if (loadLimit > displayed_parts.length) {
            loadLimit = displayed_parts.length;
        }

        let startIndex = this.current_index;
        if (startIndex >= displayed_parts.length) {
            return;
        }

        for (let i = startIndex; i < loadLimit; i++) {
            let part = displayed_parts[i];
            let span = document.createElement("span");

            let icon_path;
            let part_file_name;
            let part_file;

            if(this.is_custom) {
                icon_path = part.thumbnail || part.url;
                part_file_name = part.reference;
                part_file = part.part;
                span.setAttribute("textureID", part.id);
            } else {
                icon_path = `${this.ldraw_icon_path + part.file.split(".")[0]}.png`;
                part_file_name = part.file.split(".")[0];
                part_file = part.file;
            }

            span.id = part_file;
            span.title = part.name;
            span.classList.add('ui-tooltip');
            span.setAttribute("value", part_file);
            span.innerHTML = `
                <img src="${icon_path}" loading="lazy" />
                <br />
                <small class="part-list-number">${part_file_name}</small>
                <small class="ui-tooltip-text">${part.name}</small>
            `;

            this.select_block_contain.insertBefore(span, this.sentinel);
        }

        this.current_index = loadLimit;

        if (this.current_index >= displayed_parts.length) {
            this.observer.disconnect();
        }

        this.cutespinny.style.display = 'none';
        this.is_rendering = false;
    }
}

export { search_display_partui };