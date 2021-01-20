
```
 ~/Desktop/Blog/polynomeer.github.io   main ● ?  jekyll serve
Ignoring commonmarker-0.17.13 because its extensions are not built. Try: gem pristine commonmarker --version 0.17.13
Ignoring nokogiri-1.10.10 because its extensions are not built. Try: gem pristine nokogiri --version 1.10.10
Ignoring unf_ext-0.0.7.7 because its extensions are not built. Try: gem pristine unf_ext --version 0.0.7.7
Traceback (most recent call last):
	11: from /usr/local/bin/jekyll:23:in `<main>'
	10: from /usr/local/bin/jekyll:23:in `load'
	 9: from /Library/Ruby/Gems/2.6.0/gems/jekyll-4.2.0/exe/jekyll:11:in `<top (required)>'
	 8: from /Library/Ruby/Gems/2.6.0/gems/jekyll-4.2.0/lib/jekyll/plugin_manager.rb:52:in `require_from_bundler'
	 7: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler.rb:101:in `setup'
	 6: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler.rb:135:in `definition'
	 5: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/definition.rb:34:in `build'
	 4: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/dsl.rb:12:in `evaluate'
	 3: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/dsl.rb:47:in `eval_gemfile'
	 2: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/dsl.rb:47:in `instance_eval'
	 1: from /Users/ham/Desktop/Blog/polynomeer.github.io/Gemfile:5:in `eval_gemfile'
/System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/dsl.rb:138:in `gem': You cannot specify the same gem twice coming from different sources. (Bundler::GemfileError)
You specified that jekyll-rtd-theme (>= 0) should come from source at `.` and
	11: from /usr/local/bin/jekyll:23:in `<main>'
	10: from /usr/local/bin/jekyll:23:in `load'
	 9: from /Library/Ruby/Gems/2.6.0/gems/jekyll-4.2.0/exe/jekyll:11:in `<top (required)>'
	 8: from /Library/Ruby/Gems/2.6.0/gems/jekyll-4.2.0/lib/jekyll/plugin_manager.rb:52:in `require_from_bundler'
	 7: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler.rb:101:in `setup'
	 6: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler.rb:135:in `definition'
	 5: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/definition.rb:34:in `build'
	 4: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/dsl.rb:12:in `evaluate'
	 3: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/dsl.rb:47:in `eval_gemfile'
	 2: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/dsl.rb:47:in `instance_eval'
	 1: from /Users/ham/Desktop/Blog/polynomeer.github.io/Gemfile:5:in `eval_gemfile'
/System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/bundler/dsl.rb:138:in `gem':  (Bundler::Dsl::DSLError)
[!] There was an error parsing `Gemfile`: You cannot specify the same gem twice coming from different sources.
You specified that jekyll-rtd-theme (>= 0) should come from source at `.` and
. Bundler cannot continue.

 #  from /Users/ham/Desktop/Blog/polynomeer.github.io/Gemfile:5
 #  -------------------------------------------
 #
 >  gem "jekyll-rtd-theme"
 #
 #  -------------------------------------------
```

디렉터리 내부에 Gemfile에서 gem "jekyll-rtd-theme"이 글로번에 이미 선언되어 있어서 겹친것같다. 이를 주석처리하니깐 로컬환경에서 잘 동작하였다.

```
source "https://rubygems.org" # source "https://gems.ruby-china.com"

gemspec

# gem "jekyll-rtd-theme"

gem "github-pages", group: :jekyll_plugins

gem 'jekyll-admin', group: :jekyll_plugins
```
