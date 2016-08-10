# Require any additional compass plugins here.
Encoding.default_external = "utf-8"

# Set this to the root of your project when deployed:
http_path       = "/"
css_dir         = "css"
sass_dir        = "sass"
images_dir      = "images"
javascripts_dir = "script"

output_style  = :compressed

# line_comments = false
# sass_options  = {:debug_info => true}


# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

######################################
# Filename: version.txt
# Content of the file:
# css = x.x.x
# script = x.x.x
######################################
assets_vers = []
File.open(File.join(File.dirname(__FILE__), 'version.txt'), 'r') do |inFile|
	inFile.each_line do |line|
		vers = line.split('=')[1].strip.delete('.').to_i
		vers = (vers+1).to_s.split(//).join('.')
		assets_vers.push("#{line.split('=')[0].strip} = #{vers}")
	end
end

File.open(File.join(File.dirname(__FILE__), 'version.txt'), 'w+') do |inFile|
	assets_vers.each do |output|
		inFile.puts(output)
	end
	inFile.close
end