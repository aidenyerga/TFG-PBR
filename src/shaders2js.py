# GLSL Shaders (.vert, .frag) to JS convertor
# Eritz Yerga Gutierrez (eritzyg) - contact.eritzyg@gmail.com

import sys, os, time, re

def replacer(match):
	s = match.group(0)
	if s.startswith('/'):
		return ""
	else:
		return s

def remove_comments(text):
    pattern = re.compile(r'//.*?$|/\*.*?\*/|\'(?:\\.|[^\\\'])*\'|"(?:\\.|[^\\"])*"', re.DOTALL | re.MULTILINE)
    return re.sub(pattern, replacer, text)

def build(path = './shaders', targetpath = '.'):
	# Check paths
	if not(os.path.isdir(path)):
		print("[FATAL ERROR] Shader path \'"+path+"\' is not a valid folder.")
		exit(1)
	if not(os.path.isdir(targetpath)):
		print("[FATAL ERROR] Target path \'"+targetpath+"\' is not a valid folder.")
		exit(1)

	# Remove previous files if they exist
	try: os.remove(targetpath+'/shaders.js')
	except OSError: pass
	try: os.remove(targetpath+'/shaders.js.tmp')
	except OSError: pass

	print('Starting JS shader file build...')

	# Create a temporal file
	f = open(targetpath+'/shaders.js.tmp', 'w')
	
	# Write shaders
	f.write("var shaders={")

	# Obtain all shader folders list
	shaders = [d for d in os.listdir(path) if os.path.isdir(path+'/'+d)]
	print('Found '+str(len(shaders))+' shaders, building file...')

	# Process each .vert and .frag in the folders
	for shader in shaders:
		print('[INFO] Processing shader \"'+shader+'\"...')
		build = True

		# Check if both .vert and .frag are present
		if not(os.path.isfile(path+'/'+shader+'/'+shader+'.vert')):
			print('[ERROR] '+shader+'.vert does\'t exist, build of shader \"'+shader+'\" skipped.')
			build = False
		if not(os.path.isfile(path+'/'+shader+'/'+shader+'.frag')):
			print('[ERROR] '+shader+'.frag does\'t exist, build of shader \"'+shader+'\" skipped.')
			build = False
		
		# Only add this shader to the build if .vert and .frag are present
		if build:
			# Open .vert and .frag to read them
			vert = open(path+'/'+shader+'/'+shader+'.vert', 'r')
			frag = open(path+'/'+shader+'/'+shader+'.frag', 'r')

			# Add shader name to the list
			if shader == shaders[0]:
				f.write(shader)
			else:
				f.write(','+shader)
			
			# Write vertex shader
			f.write(':{vert:'+'\"')
			for line in remove_comments(vert.read()).split("\n"):
				if line != '' and line != ' ' and line != '\n' and line != ' \n' and line != '\t\n':
					f.write(line+'\\n')

			# Write frgament shader
			f.write('\",frag:'+'\"')
			for line in remove_comments(frag.read()).split("\n"):
				if line != '' and line != ' ' and line != '\n' and line != ' \n' and line != '\t\n':
					f.write(line+'\\n')
			f.write('\"}')

			vert.close()
			frag.close()
			print('[INFO] Shader \"'+shader+'\" processed.')

	print('Finished processing all shaders.')
	f.write('};')

	# Finished building the file
	f.close()

	# Rename the temporal file to the final name
	os.rename(targetpath+'/shaders.js.tmp', targetpath+'/shaders.js')
	print('Finished.')

def printhelp():
	print("Script usage: python shaders2js.py [-h]")
	print("or: python shaders2js.py <shaderpath> <targetpath>")
	print("--------------------------------------------------------------------")
	print("  -h: Print this help.")
	print("  <shaderpath>: Route to directory where all shaders are (each one must be in each own folder containing the .vert and .frag files). [If not specified it will be \'./shaders\']")
	print("  <targetpath>: Route to directory where the \'shaders.js\' file will be created. [If not specified it will be \'.\']")
	print("  <option>:")

if __name__ == "__main__":
	if len(sys.argv) < 2:
		build()
		exit(0)
	elif len(sys.argv) == 2:
		if sys.argv[1] == '-h':
			printhelp()
			exit(0)
		else:
			print("Argument not recognized: "+sys.argv[1])
			printhelp()
			exit(1)
	elif len(sys.argv) == 3:
		build(sys.argv[1], sys.argv[2])
		exit(0)
	else:
		print("Wrong call to shaders2py.py: Too many arguments")
		printhelp()
		exit(1)
